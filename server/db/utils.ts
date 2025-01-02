import { db, userTable } from '@/server/db';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';

export const getUserByEmail = (email: string) => {
  return db.select().from(userTable).where(eq(userTable.email, email));
};

type RegisterUserParams = {
  id: string;
  email: string;
  password: string;
  bucketName: string;
};

export const registerNewUser = ({
  id,
  email,
  password,
  bucketName,
}: RegisterUserParams) => {
  return db.insert(userTable).values({ id, email, password, bucketName });
};

export const getUserCredits = async (id: string) => {
  const result = await db
    .select({ creditsLeft: userTable.creditsLeft })
    .from(userTable)
    .where(eq(userTable.id, id));

  return result[0]?.creditsLeft ?? 0;
};

export const reduceUserCredit = async (userId: string) => {
  const result = await db
    .update(userTable)
    .set({
      creditsLeft: sql`${userTable.creditsLeft} - 1`,
    })
    .where(eq(userTable.id, userId))
    .returning();

  console.log(`REDUCED POINT`, result);
};
