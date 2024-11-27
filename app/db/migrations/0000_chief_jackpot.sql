CREATE TABLE IF NOT EXISTS "user_domains" (
	"user_id" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL
);
