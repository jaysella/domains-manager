import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserDomains = pgTable('user_domains', {
  // This will be the user ID provided by Clerk
  user_id: text('user_id').primaryKey(),
  domain: text('domain').notNull(),
  source: text('source').notNull().default('manual'), // 'auto' or 'manual'
  createTs: timestamp('create_ts').defaultNow().notNull()
});

export const Subdomains = pgTable('subdomains', {
  subdomain: text('subdomain').primaryKey(),
  domain: text('domain').notNull().references(() => UserDomains.domain),
  description: text('description'),
});
