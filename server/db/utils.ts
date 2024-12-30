import { createClient } from '@/lib/supabase/server';
import { db, userTable } from '@/server/db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';

const supabase = createClient(await cookies());

export const getUserByEmail = (email: string) => {
  return db.select().from(userTable).where(eq(userTable.email, email));
};

export const registerNewUser = (email: string, password: string) => {
  const bucketId = randomUUID();
  return db.insert(userTable).values({ email, password, bucketId });
};

export const getUserCredits = async (id: number) => {
  const result = await db
    .select({ creditsLeft: userTable.creditsLeft })
    .from(userTable)
    .where(eq(userTable.id, id));
  return result[0].creditsLeft;
};

export const getUserBucket = async (id: number) => {
  const result = await db
    .select({ bucketId: userTable.bucketId })
    .from(userTable)
    .where(eq(userTable.id, id));
  if (result.length === 0) return null;

  const userBucketId = result[0].bucketId;
  return supabase.storage.from(userBucketId);
};
