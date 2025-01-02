'use server';
import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import {
  getBucketName,
  reduceUserCredit,
  registerNewUser,
  getUserCredits,
} from '../db';
import { env } from '@/lib/env/server';
import { removeBgGradio, removeBgReplicate } from '@/lib/services';

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
  bucketName: string;
  path: string;
  token: string;
  file: File;
};

export const processImage = async ({
  path,
  token,
  bucketName,
  file,
}: ProcessImageArgs) => {
  const supabase = createClient(await cookies());

  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  if (!user.data || user.error || !userId) return { error: 'UNAUTHORIZED' };

  const userCredit = await getUserCredits(userId);
  if (userCredit === 0) return { error: 'UNSUFFICIENT CREDIT' };

  const bucket = supabase.storage.from(bucketName);
  const usingGradio = !!env.USE_GRADIO;

  const processedImage = usingGradio
    ? await removeBgGradio('')
    : await removeBgReplicate(file);

  if (!processedImage) return { error: 'Failed to process' };

  if (usingGradio === false && process.env.NODE_ENV === 'production') {
    await reduceUserCredit(userId);
  }

  const { data, error } = await bucket.uploadToSignedUrl(
    path,
    token,
    processedImage,
  );
  if (!data || error) return { error: 'Failed to upload' };

  return { error: null };
};
