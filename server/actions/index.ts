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
  console.log('DEBUG', 'createSupabaseClient');
  const supabase = createClient(await cookies());
  console.log('DEBUG', 'createSupabaseClient', supabase);

  console.log('DEBUG', 'connect to gradio');
  const client = await Client.connect(env.GRADIO_API_URL);
  console.log('DEBUG', 'connect to gradio', client);

  console.log('DEBUG', 'predict gradio');
  const result = await client.predict('/process_image_1', {
    image_source: originalImageUrl,
  });
  console.log('DEBUG', 'predict gradio', result);

  console.log('DEBUG', 'get bucket');
  const bucket = supabase.storage.from(bucketName);
  console.log('DEBUG', 'get bucket', bucket);

  console.log('DEBUG', 'uploadToSignedUrl');

  // @ts-expect-error hdhdveuv
  const p = await fetch(result.data[0].url).then((r) => r.blob());

  // @ts-expect-error tjdjdhshs
  const f = new File([p], path.split('/').at(-1), { type: 'image/png' });
  const { data, error } = await bucket.uploadToSignedUrl(path, token, f);
  console.log('DEBUG', 'uploadToSignedUrl', { data, error });
  if (!data || error) return { error: 'Failed to upload' };

  console.log('DEBUG', { data });

  return { error: null };
};
