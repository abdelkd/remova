import { db, userTable } from '@/server/db';
import { eq } from 'drizzle-orm';

export const getUserByEmail = (email: string) => {
  return db.select().from(userTable).where(eq(userTable.email, email));
};

export const registerNewUser = (email: string, password: string) => {
  return db.insert(userTable).values({ email, password });
};
