import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '@/lib/env/server';

export const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});

export * from './schema';
export * from './utils';
