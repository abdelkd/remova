'use server';

import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { registerNewUser } from '../db';
import { randomUUID } from 'node:crypto';

export const loginUser = async ({ email, password }: AuthForm) => {
  const supabase = createClient(await cookies());
  const bucketId = randomUUID();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      data: { bucketId },
    },
  });
  console.log({ data, error });
  if (error) {
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
    if (error) {
      console.error(error);
      return { data, error };
    }

    const { id } = data.user;
    const bucketId = randomUUID();
    await registerNewUser({ id, email, password, bucketId });
    return { data, error };
  } catch (err) {
    console.log(err);
    return { data: null, error: true };
  }
};
