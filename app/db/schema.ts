import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const UserDomains = pgTable('user_domains', {
  domain: text('domain').primaryKey(),
  owner_id: text('owner_id').notNull(),
  source: text('source').notNull().default('manual'), // 'auto' or 'manual'
  createTs: timestamp('create_ts').defaultNow().notNull()
});

export const Subdomains = pgTable('subdomains', {
  subdomain: text('subdomain').primaryKey(),
  owner_id: text('owner_id').notNull(),
  domain: text('domain').notNull().references(() => UserDomains.domain),
  description: text('description'),
  host: text('host'),
});
