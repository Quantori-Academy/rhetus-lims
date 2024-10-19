import { pgTable, timestamp, varchar, text, uuid, real, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { storages } from './storages.js';

export const reagents = pgTable('reagents', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	name: varchar('name', { length: 256 }).notNull(),
	casNumber: varchar('cas_number', { length: 12 }).default(null),
	producer: varchar('producer', { length: 256 }).default(null),
	catalogId: varchar('catalog_id', { length: 256 }).default(null),
	catalogLink: text('catalog_link').default(null),
	unitPrice: real('unit_price').notNull().default(0),
	quantityUnit: varchar('quantity_unit', { length: 256 }).notNull(),
	quantity: real('quantity').notNull(),
	quantityLeft: real('quantity_left').notNull(),
	expirationDate: timestamp('expiration_date').default(null),
	storageLocationId: uuid('storage_location_id').references(() => storages.id),
	description: text('description').default(''),
	deleted: boolean('deleted').default(false)
});
