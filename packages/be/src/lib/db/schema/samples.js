import { pgTable, timestamp, varchar, text, uuid, real, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { storages } from './storages.js';
import { mol } from '../structure/types/mol.js';

export const samples = pgTable('samples', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	name: varchar('name', { length: 256 }).notNull(),
	quantityUnit: varchar('quantity_unit', { length: 256 }).notNull(),
	quantity: real('quantity').notNull(),
	quantityLeft: real('quantity_left').notNull(),
	expirationDate: timestamp('expiration_date').notNull(),
	storageId: uuid('storage_id').references(() => storages.id),
	description: text('description').default(''),
	structure: mol('structure'),
	deleted: boolean('deleted').default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
