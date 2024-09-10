import { eq } from 'drizzle-orm';
import { schema } from '../../lib/db/schema/index.js';
import fp from 'fastify-plugin';

async function citiesService(server) {
	server.decorate('citiesService', {
		getCityById: async id => {
			const result = await server.db
				.select()
				.from(schema.cities)
				.where(eq(schema.cities.id, id))
				.limit(1);

			return result[0];
		},
		createCity: async data => {
			const result = await server.db
				.insert(schema.cities)
				.values({
					name: data.name,
					popularity: data.popularity
				})
				.returning();

			return result[0];
		},
		updateCityById: async (id, { name, popularity }) => {
			const result = await server.db
				.update(schema.cities)
				.set({
					name: name,
					population: popularity
				})
				.where(eq(schema.cities.id, id))
				.returning();

			return result[0];
		},
		deleteCityById: async id => {
			const result = await server.db
				.delete(schema.cities)
				.where(eq(schema.cities.id, id))
				.returning();

			return result[0];
		}
	});
}

export default fp(citiesService);
