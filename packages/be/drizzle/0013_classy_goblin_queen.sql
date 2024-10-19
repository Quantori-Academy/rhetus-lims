ALTER TABLE "reagents" ALTER COLUMN "producer" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "producer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "unit_price" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "quantity" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "expiration_date" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "expiration_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reagents" ALTER COLUMN "storage_location_id" SET DATA TYPE uuid USING (uuid_generate_v4());--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reagents" ADD CONSTRAINT "reagents_storage_location_id_storages_id_fk" FOREIGN KEY ("storage_location_id") REFERENCES "public"."storages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
