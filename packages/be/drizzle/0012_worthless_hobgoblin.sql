ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted" boolean DEFAULT false NOT NULL;