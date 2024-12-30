import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

import type { InferSelectModel } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

export const userTable = sqliteTable('user', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  creditsLeft: integer('credits_left').notNull().default(0),
  bucketId: text('bucket_id').notNull().$defaultFn(randomUUID),
});

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer('expires_at', {
    mode: 'timestamp',
  }).notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
