import {
	integer,
	pgTable,
	timestamp,
	varchar,
	text,
	uuid,
	real,
	boolean
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const reagents = pgTable('reagents', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	name: varchar('name', { length: 256 }).notNull(),
	// TODO: add structure in next milestones
	// structure: text('structure').notNull(),
	casNumber: varchar('cas_number', { length: 12 }).default(null),
	producer: varchar('producer', { length: 256 }).notNull(),
	catalogId: varchar('catalog_id', { length: 256 }).default(null),
	catalogLink: text('catalog_link').default(null),
	unitPrice: real('unit_price').notNull(),
	quantityUnit: varchar('quantity_unit', { length: 256 }).notNull(),
	quantity: integer('quantity').notNull(),
	quantityLeft: real('quantity_left').notNull(),
	expirationDate: timestamp('expiration_date').notNull(),
	storageLocationId: integer('storage_location_id'),
	// TODO: add reference to storage, when it will be done
	// .references(() => locations.id),
	description: text('description').default(''),
	enabled: boolean('enabled').default(true)
});
