import { integer, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { countries } from './countries.js';

export const popularityEnum = pgEnum('popularity', ['unknown', 'known', 'popular']);

export const cities = pgTable('cities', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 256 }),
	countryId: integer('country_id').references(() => countries.id),
	popularity: popularityEnum('popularity')
});
