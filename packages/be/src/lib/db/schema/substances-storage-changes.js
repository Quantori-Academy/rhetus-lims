import { pgTable, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

import { reagents } from './reagents.js';
import { samples } from './samples.js';
import { storages } from './storages.js';
import { users } from './users.js';

export const substancesStorageChanges = pgTable('substances_storage_changes', {
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
	previousStorageId: uuid('previous_storage_id')
		.references(() => storages.id)
		.notNull(),
	targetStorageId: uuid('target_storage_id')
		.references(() => storages.id)
		.notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
