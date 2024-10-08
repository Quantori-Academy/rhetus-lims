DO $$ BEGIN
 CREATE TYPE "public"."password_request_status" AS ENUM('none', 'active', 'confirmed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "password_reset_requests";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_status" "password_request_status" DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "should_reset_password";