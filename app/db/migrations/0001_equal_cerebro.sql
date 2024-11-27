CREATE TABLE IF NOT EXISTS "subdomains" (
	"subdomain" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"description" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subdomains" ADD CONSTRAINT "subdomains_domain_user_domains_domain_fk" FOREIGN KEY ("domain") REFERENCES "public"."user_domains"("domain") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
