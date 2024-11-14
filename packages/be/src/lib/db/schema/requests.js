import {
	integer,
	pgTable,
	timestamp,
	varchar,
	text,
	pgEnum,
	boolean,
	real,
	uuid
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { orders } from './orders.js';

export const RequestStatus = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	COMPLETED: 'completed',
	CANCELED: 'canceled'
};

export const requestStatusEnum = pgEnum('reagent_request_status', Object.values(RequestStatus));

export const requests = pgTable('requests', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	userId: integer('user_id').references(() => users.id),
	userComment: text('user_comment').default(null),
	poComment: text('po_comment').default(null),
	requestStatus: requestStatusEnum('request_status').default(RequestStatus.PENDING),
	reagentName: text('reagent_name').notNull(),
	structure: text('structure').default(null),
	casNumber: varchar('cas_number', { length: 12 }).default(null),
	quantity: real('quantity').notNull(),
	quantityUnit: varchar('quantity_unit', { length: 256 }).notNull(),
	amount: integer('amount').notNull().default(1),
	orderId: uuid('order_id')
		.references(() => orders.id)
		.default(null),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	deleted: boolean('deleted').default(false)
});
