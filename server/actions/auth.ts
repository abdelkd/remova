'use server';
import { revalidatePath } from 'next/cache';

import type { AuthForm } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { registerNewUser } from '@/server/db';

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

    await registerNewUser({ id: data.user.id, email, password });

    return { data, error };
  } catch (err) {
    console.log(err);
    return { data: { user: null }, error: true };
  }
};
