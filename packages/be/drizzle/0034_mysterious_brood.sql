ALTER TABLE "reagents" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "samples" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;