'use server';

import argon2 from 'argon2';

import { AuthForm } from '@/types';
import { getBucketName, getUserByEmail, registerNewUser } from '@/server/db';
import {
  createSession,
  generateSessionToken,
  getCurrentSession,
  setSessionTokenCookie,
} from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';

export const loginUser = async ({ email }: AuthForm) => {
  const user = await getUserByEmail(email);
  if (user.length === 0) return null;

  const token = generateSessionToken();
  const session = await createSession(token, user[0].id);
  await setSessionTokenCookie(token, session.expiresAt);

  return session;
};

export const signupUser = async ({ email, password }: AuthForm) => {
  const user = await getUserByEmail(email);
  if (user.length !== 0) return user;

  const supabase = createClient(await cookies());

  try {
    const bucketId = randomUUID();
    const hashedPassword = await argon2.hash(password);

    await registerNewUser({ email, password: hashedPassword, bucketId });
    await supabase.storage.createBucket(bucketId);

    return null;
  } catch {
    return null;
  }
};

export const getSignedURL = async (filepath: string) => {
  const { user } = await getCurrentSession();
  if (!user) return null;

  const supabase = createClient(await cookies());

  const bucketName = await getBucketName(user.id);
  if (!bucketName) return null;

  const userBucket = supabase.storage.from(bucketName);
  if (!userBucket) return null;

  return (await userBucket.createSignedUploadUrl(filepath)).data;
};
