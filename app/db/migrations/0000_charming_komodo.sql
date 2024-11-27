CREATE TABLE IF NOT EXISTS "subdomains" (
	"subdomain" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_domains" (
	"domain" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subdomains" ADD CONSTRAINT "subdomains_domain_user_domains_domain_fk" FOREIGN KEY ("domain") REFERENCES "public"."user_domains"("domain") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
