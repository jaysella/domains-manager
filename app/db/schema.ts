import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserDomains = pgTable('user_domains', {
  // This will be the user ID provided by Clerk
  user_id: text('user_id').primaryKey().notNull(),
  domain: text('domain').notNull(),
  source: text('source').notNull().default('manual'), // 'auto' or 'manual'
  createTs: timestamp('create_ts').defaultNow().notNull()
});
