import { integer, pgTable, timestamp, text, uuid, real } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { users } from './users.js';
import { reagents } from './reagents.js';

export const substancesQuantityChanges = pgTable('substances_quantity_changes', {
	id: uuid('id')
		.primaryKey()
		.default(sql`uuid_generate_v4()`),
	userId: integer('user_id').references(() => users.id),
	reagentId: uuid('reagent_id')
		.references(() => reagents.id)
		.default(null),
	sampleId: uuid('sample_id').default(null),
	// TODO: add reference after samples will be implemented
	// .references(() => samples.id),
	previousValue: real('previous_value').notNull(),
	targetValue: real('target_value').notNull(),
	changeReason: text('change_reason').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});