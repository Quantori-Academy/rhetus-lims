CREATE TABLE IF NOT EXISTS "reagents" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(256) NOT NULL,
	"cas_number" varchar(12) DEFAULT null,
	"producer" varchar(256) NOT NULL,
	"catalog_id" varchar(256) DEFAULT null,
	"catalog_link" text DEFAULT null,
	"unit_price" real NOT NULL,
	"quantity_unit" varchar(256) NOT NULL,
	"size" integer NOT NULL,
	"quantity_left" real NOT NULL,
	"expiration_date" timestamp NOT NULL,
	"storage_location_id" integer NOT NULL,
	"description" text DEFAULT '',
	"enabled" boolean DEFAULT true
);
