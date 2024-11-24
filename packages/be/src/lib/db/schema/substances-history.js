import {
	integer,
	pgTable,
	timestamp,
	uuid,
	boolean,
	real,
	varchar,
	text
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { users } from './users.js';
import { reagents } from './reagents.js';
import { samples } from './samples.js';
import { storages } from './storages.js';

export const substancesHistory = pgTable('substances_history', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	userId: integer('user_id').references(() => users.id),
	reagentId: uuid('reagent_id')
		.references(() => reagents.id)
		.default(null),
	sampleId: uuid('sample_id')
		.references(() => samples.id)
		.default(null),
	previousValue: real('previous_value').default(null),
	targetValue: real('target_value').default(null),
	quantityUnit: varchar('quantity_unit').default(null),
	previousStorageId: uuid('previous_storage_id')
		.references(() => storages.id)
		.default(null),
	targetStorageId: uuid('target_storage_id')
		.references(() => storages.id)
		.default(null),
	actionType: varchar('action_type').notNull(),
	changeReason: text('change_reason').default(null),
	isDeleted: boolean('deleted').default(false),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
