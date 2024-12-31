'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
  if (error) {
    redirect('/error');
  }

  const { id } = data.user;
  const bucketId = randomUUID();
  await registerNewUser({ id, email, password, bucketId });

  revalidatePath('/app', 'layout');
  redirect('/app');
};
