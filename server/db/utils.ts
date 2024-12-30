import { db, userTable } from '@/server/db';
import { eq } from 'drizzle-orm';

export const getUserByEmail = (email: string) => {
  return db.select().from(userTable).where(eq(userTable.email, email));
};

type RegisterUserParams = {
  email: string;
  password: string;
  bucketId: string;
};

export const registerNewUser = ({
  email,
  password,
  bucketId,
}: RegisterUserParams) => {
  return db.insert(userTable).values({ email, password, bucketId });
};

export const getUserCredits = async (id: number) => {
  const result = await db
    .select({ creditsLeft: userTable.creditsLeft })
    .from(userTable)
    .where(eq(userTable.id, id));
  return result[0].creditsLeft;
};

export const getBucketName = async (id: number) => {
  const result = await db
    .select({ bucketId: userTable.bucketId })
    .from(userTable)
    .where(eq(userTable.id, id));
  if (result.length === 0) return null;

  return result[0].bucketId;
};
