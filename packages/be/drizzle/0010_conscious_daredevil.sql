CREATE TABLE IF NOT EXISTS "storages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"room" varchar(300) NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL
);
  