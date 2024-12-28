import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from './lib/env/server';

export default defineConfig({
  out: './drizzle',
  schema: './server/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
