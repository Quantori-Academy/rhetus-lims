import { and, eq, notExists } from 'drizzle-orm';
import { schema } from '../../lib/db/schema/index.js';
import fp from 'fastify-plugin';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { helpers } from '../../lib/utils/common/helpers.js';

const formatMapping = {
	name: string => helpers.capitalize(string),
	room: string => helpers.capitalize(string)
};

async function storagesService(server) {
	server.decorate('storagesService', {
		createStorage: async data => {
			const { name, room, description } = data;
			const result = await server.db
				.insert(schema.storages)
				.values({
					name: formatMapping.name(name),
					room: formatMapping.room(room),
					description
				})
				.returning({ name: schema.storages.name });
			return result.length ? result[0].name : null;
		},

		getStorages: async queryParams => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			let query = server.db
				.select({
					id: schema.storages.id,
					name: schema.storages.name,
					room: schema.storages.room,
					description: schema.storages.description,
					creationDate: schema.storages.createdAt,
					isEmpty: server.storagesService.isEmptyQuery().as('isEmpty')
				})
				.from(schema.storages);

			query = applyFilters(query, { ...options, deleted: 'false' }, 'storages');

			query = applySorting(query, sort, 'storages');

			const count = await query;
			const storages = await query.limit(limit).offset(offset);
			return {
				storages,
				count: count.length
			};
		},

		getStorageById: async id => {
			const result = await server.db
				.select({
					id: schema.storages.id,
					room: schema.storages.room,
					name: schema.storages.name,
					description: schema.storages.description,
					creationDate: schema.storages.createdAt,
					isEmpty: server.storagesService.isEmptyQuery().as('isEmpty')
				})
				.from(schema.storages)
				.where(and(eq(schema.storages.id, id), eq(schema.storages.deleted, false)));
			return result[0];
		},

		updateStorage: async (id, data) => {
			const result = await server.db
				.update(schema.storages)
				.set(data)
				.where(and(eq(schema.storages.id, id), eq(schema.storages.deleted, false)))
				.returning({ name: schema.storages.name });
			return result.length ? result[0].name : null;
		},

		softDeleteStorage: async id => {
			const result = await server.db
				.update(schema.storages)
				.set({
					deleted: true
				})
				.where(eq(schema.storages.id, id))
				.returning({ name: schema.storages.name });
			return result.length ? result[0].name : null;
		},

		isStorageEmpty: async id => {
			const reagents = await server.reagentsService.getReagentsByStorageId(id);
			const samples = await server.samplesService.getSamplesByStorageId(id);

			if (reagents.length > 0 || samples.length > 0) {
				return false;
			}

			return true;
		},

		isEmptyQuery: () => {
			return and(
				notExists(
					server.db
						.select({ id: schema.reagents.id })
						.from(schema.reagents)
						.where(eq(schema.reagents.storageId, schema.storages.id))
				),
				notExists(
					server.db
						.select({ id: schema.samples.id })
						.from(schema.samples)
						.where(eq(schema.samples.storageId, schema.storages.id))
				)
			);
		},

		getUniqValuesByField: async fieldName => {
			const result = await server.db
				.selectDistinct({ field: schema.storages[fieldName] })
				.from(schema.storages)
				.where(eq(schema.storages.deleted, false));

			return result.length ? result.map(({ field }) => field) : [];
		},

		getUniqPairsOfNamesAndRooms: async () => {
			const result = await server.db
				.selectDistinct({ room: schema.storages.room, name: schema.storages.name })
				.from(schema.storages)
				.where(eq(schema.storages.deleted, false));

			return result.length ? result : [];
		}
	});
}

export default fp(storagesService);
