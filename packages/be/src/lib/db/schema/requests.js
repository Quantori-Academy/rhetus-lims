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

export const RequestStatus = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	DECLINED: 'declined'
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
	// TODO: add correct type after structure implementation
	structure: text('structure').default(null),
	casNumber: varchar('cas_number', { length: 12 }).default(null),
	quantity: real('quantity').notNull(),
	orderId: uuid('order_id').default(null),
	// TODO: uncomment reference after order implementation
	// .references(()=> orders.id)
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
	deleted: boolean('deleted').default(false)
});
