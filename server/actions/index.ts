'use server';

import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { getBucketName, registerNewUser } from '../db';

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
  filename,
  bucketName,
  originalImageUrl,
}: ProcessImageArgs) => {
  const supabase = createClient(await cookies());
  const body = JSON.stringify({
    source_url: originalImageUrl,
  });

  let isError = false;

  const file = await fetch(`${process.env.COLAB}/process`, {
    body,
    method: 'POST',
    headers: {
      'User-Agent': 'pew',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1',
    },
  })
    .then((r) => {
      console.log(r.ok);
      return r;
    })
    .then((r) => r.blob())
    .then((blob) => new File([blob], filename, { type: blob.type }))
    .catch(() => {
      isError = true;
    });

  if (isError) return { error: 'Something went wrong' };
  if (!file) return { error: 'Empty Response' };

  const bucket = supabase.storage.from(bucketName);
  const { data, error } = await bucket.uploadToSignedUrl(path, token, file);
  if (!data || error) return { error: 'Failed to upload' };

  console.log('DEBUG', { data });

  return { error: null };
};
