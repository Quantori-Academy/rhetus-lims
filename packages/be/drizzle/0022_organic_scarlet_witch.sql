DO $$ BEGIN
 CREATE TYPE "public"."reagent_request_status" AS ENUM('pending', 'ordered', 'fulfilled', 'declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "requests" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" integer,
	"user_comment" text DEFAULT null,
	"po_comment" text DEFAULT null,
	"request_status" "reagent_request_status" DEFAULT 'pending',
	"reagent_name" text NOT NULL,
	"structure" text DEFAULT null,
	"cas_number" varchar(12) DEFAULT null,
	"quantity" real NOT NULL,
	"order_id" uuid DEFAULT null,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
