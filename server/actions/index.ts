'use server';

import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { registerNewUser } from '../db';
import { randomUUID } from 'node:crypto';

export const loginUser = async ({ email, password }: AuthForm) => {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log({ data, error });
  if (!data.user || error) {
    console.error(error);
    return { data, error };
    // redirect('/error');
  }

  console.log({ data });

  revalidatePath('/app', 'layout');
  return { data, error };
  // redirect('/app');
};

export const signUpUser = async ({ email, password }: AuthForm) => {
  const supabase = createClient(await cookies());
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (!data.user || error) {
      console.error(error);
      return { data, error };
    }

    const bucketId = randomUUID();
    await registerNewUser({ id: data.user.id, email, password, bucketId });
    const { data, error } = await supabase.storage.createBucket(data.user.id);
    console.log({ data, error });

    return { data, error };
  } catch (err) {
    console.log(err);
    return { data: { user: null }, error: true };
  }
};
