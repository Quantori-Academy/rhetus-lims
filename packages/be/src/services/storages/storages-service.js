import { eq } from 'drizzle-orm';
import { schema } from '../../lib/db/schema/index.js';
import fp from 'fastify-plugin';

async function storagesService(server) {
	server.decorate('storagesService', {
		createStorage: async data => {
			const { name, room, description } = data;
			const result = await server.db
				.insert(schema.storages)
				.values({
					name: name,
					room: room,
					description: description,
					createdAt: new Date()
				})
				.returning({ name: schema.storages.name });
			return result.length ? result[0].name : null;
		},
		getStorages: async () => {
			const result = await server.db
				.select({
					id: schema.storages.id,
					name: schema.storages.name,
					room: schema.storages.room,
					description: schema.storages.description
				})
				.from(schema.storages);
			console.log('result info', result);
			return {
				storages: result,
				count: 1
			};
		},
		getStorageById: async id => {
			const result = await server.db
				.select()
				.from(schema.storages)
				.where(eq(schema.storages.id, id));
			return result[0];
		},
		updateStorage: async (id, data) => {
			const result = await server.db
				.update(schema.storages)
				.set(data)
				.where(eq(schema.storages.id, id))
				.returning({ name: schema.storages.name });
			return result.length ? result[0].name : null;
		}
	});
}

export default fp(storagesService);
