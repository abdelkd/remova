import { db, userTable } from '@/server/db';
import { eq } from 'drizzle-orm';

export const getUserByEmail = (email: string) => {
  return db.select().from(userTable).where(eq(userTable.email, email));
};

type RegisterUserParams = {
  id: string;
  email: string;
  password: string;
  bucketId: string;
};

export const registerNewUser = ({
  id,
  email,
  password,
  bucketId,
}: RegisterUserParams) => {
  return db.insert(userTable).values({ id, email, password, bucketId });
};

export const getUserCredits = async (id: string) => {
  const result = await db
    .select({ creditsLeft: userTable.creditsLeft })
    .from(userTable)
    .where(eq(userTable.id, id));
  console.log({ result });
  return result[0]?.creditsLeft ?? 10;
};

export const getBucketName = async (id: string) => {
  const result = await db
    .select({ bucketId: userTable.bucketId })
    .from(userTable)
    .where(eq(userTable.id, id));
  if (result.length === 0) return null;

  console.log({ result });

  return result[0].bucketId;
};
