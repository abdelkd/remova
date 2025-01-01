'use server';

import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getBucketName, registerNewUser } from '../db';
import { env } from '@/lib/env/server';
import { removeBgGradio, removeBgReplicate } from '@/lib/bgService';

export const maxDuration = 60;

export const loginUser = async ({ email, password }: AuthForm) => {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!data.user || error) {
    console.error(error);
    return { data, error };
  }

  revalidatePath('/app', 'layout');
  return { data, error };
};

export const signUpUser = async ({ email, password }: AuthForm) => {
  const supabase = createClient(await cookies());
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!data.user || error) {
      console.error(error);
      return { data: { user: null }, error: true };
    }

    const bucketName = getBucketName(data.user.id);
    await registerNewUser({ id: data.user.id, email, password, bucketName });

    const bucketResult = await supabase.storage.createBucket(bucketName);

    if (bucketResult.error) {
      console.error(bucketResult.error);
      await supabase.auth.admin.deleteUser(data.user.id);
      return { data: { user: null }, error: true };
    }

    return { data, error };
  } catch (err) {
    console.log(err);
    return { data: { user: null }, error: true };
  }
};

type ProcessImageArgs = {
  filename: string;
  bucketName: string;
  path: string;
  token: string;
  originalImageUrl: string;
};

export const processImage = async ({
  filename,
  path,
  token,
  bucketName,
  originalImageUrl,
}: ProcessImageArgs) => {
  const supabase = createClient(await cookies());
  const bucket = supabase.storage.from(bucketName);

  const processedImage = !!env.USE_GRADIO
    ? await removeBgGradio(originalImageUrl, filename)
    : await removeBgReplicate(originalImageUrl, filename);
  if (!processedImage) return { error: 'Failed to process' };

  const { data, error } = await bucket.uploadToSignedUrl(
    path,
    token,
    processedImage,
  );
  if (!data || error) return { error: 'Failed to upload' };

  return { error: null };
};
