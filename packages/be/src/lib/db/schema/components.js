import { pgTable, uuid, real } from 'drizzle-orm/pg-core';
import { samples } from './samples.js';
import { reagents } from './reagents.js';

export const components = pgTable('components', {
	id: uuid('id').references(() => samples.id),
	sampleId: uuid('sample_id')
		.references(() => samples.id)
		.default(null),
	reagentId: uuid('reagent_id')
		.references(() => reagents.id)
		.default(null),
	quantityUsed: real('quantity_used').notNull()
});
