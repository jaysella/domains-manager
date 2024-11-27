ALTER TABLE "user_domains" RENAME COLUMN "user_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "subdomains" ADD COLUMN "owner_id" text NOT NULL;