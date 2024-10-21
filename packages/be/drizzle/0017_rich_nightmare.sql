ALTER TABLE "reagents" RENAME COLUMN "storage_location_id" TO "storage_id";--> statement-breakpoint
ALTER TABLE "reagents" DROP CONSTRAINT "reagents_storage_location_id_storages_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reagents" ADD CONSTRAINT "reagents_storage_id_storages_id_fk" FOREIGN KEY ("storage_id") REFERENCES "public"."storages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
