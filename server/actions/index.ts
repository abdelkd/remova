'use server';

import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getBucketName, registerNewUser } from '../db';
import { env } from '@/lib/env/server';
import { Client } from '@gradio/client';

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
  path,
  token,
  bucketName,
  originalImageUrl,
}: ProcessImageArgs) => {
  const supabase = createClient(await cookies());
  const client = await Client.connect(env.GRADIO_API_URL);
  const result = await client.predict('/predit_image_1', {
    image_source: originalImageUrl,
  });

  const bucket = supabase.storage.from(bucketName);

  const { data, error } = await bucket.uploadToSignedUrl(
    path,
    token,
    result.data as File,
  );
  if (!data || error) return { error: 'Failed to upload' };

  console.log('DEBUG', { data });

  return { error: null };
};
