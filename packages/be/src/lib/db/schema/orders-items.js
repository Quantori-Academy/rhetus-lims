import {
	pgTable,
	uuid,
	integer,
	timestamp,
	varchar,
	text,
	real,
	pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from './orders.js';
import { requests } from './requests.js';

export const ItemTypes = {
	REAGENT: 'reagent',
	REQUEST: 'request'
};

export const itemTypesEnum = pgEnum('order_item_type', Object.values(ItemTypes));

export const ordersItems = pgTable('orders_items', {
	tempId: uuid('temp_id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	orderId: uuid('order_id').references(() => orders.id),
	requestId: uuid('request_id')
		.references(() => requests.id)
		.default(null),
	itemType: itemTypesEnum('item_type').notNull(),
	reagentName: text('reagent_name').notNull(),
	structure: text('structure').default(null),
	casNumber: varchar('cas_number', { length: 12 }).default(null),
	producer: varchar('producer', { length: 256 }).default(null),
	catalogId: varchar('catalog_id', { length: 256 }).default(null),
	catalogLink: text('catalog_link').default(null),
	unitPrice: real('unit_price').default(null),
	quantityUnit: varchar('quantity_unit', { length: 256 }).notNull(),
	quantity: real('quantity').notNull(),
	amount: integer('amount').notNull().default(1),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date())
});
