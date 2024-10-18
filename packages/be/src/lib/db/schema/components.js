import { pgEnum, pgTable, uuid, real, varchar } from 'drizzle-orm/pg-core';
import { samples } from './samples.js';
import { reagents } from './reagents.js';

export const Category = {
	REAGENT: 'reagent',
	SAMPLE: 'sample'
};

export const categoryEnum = pgEnum('category', Object.values(Category));

export const components = pgTable('components', {
	id: uuid('id').references(() => samples.id),
	sampleId: uuid('sample_id')
		.references(() => samples.id)
		.default(null),
	reagentId: uuid('reagent_id')
		.references(() => reagents.id)
		.default(null),
	quantityUsed: real('quantity_used').notNull(),
	quantityUnit: varchar('quantity_unit', { length: 256 }).notNull(),
	category: categoryEnum('category').notNull()
});
