import { and, eq, notExists } from 'drizzle-orm';
import { schema } from '../../lib/db/schema/index.js';
import { generateFilterSubquery } from '../../lib/utils/db/filter-subquery-generator.js';
import { generateOrderSubquery } from '../../lib/utils/db/order-subquery-generator.js';
import fp from 'fastify-plugin';

const formatMapping = {
	name: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`,
	room: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`
};

const optionsDictionary = {
	name: {
		property: 'name',
		schema: 'storages'
	},
	room: {
		property: 'room',
		schema: 'storages'
	}
};

const sortDictionary = {
	creationdate: 'created_at'
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
			const limit = Number(queryParams.limit) || 10;
			const page = Number(queryParams.page) || 1;
			const options = queryParams.options || null;
			const sort = queryParams.sort || null;

			const offset = page === 1 ? 0 : (page - 1) * limit;

			let query = server.db
				.select({
					id: schema.storages.id,
					name: schema.storages.name,
					room: schema.storages.room,
					description: schema.storages.description,
					creationDate: schema.storages.createdAt,
					isEmpty: server.storagesService.isEmptyQuery().as('isEmpty')
				})
				.from(schema.storages)
				.where(eq(schema.storages.deleted, false));

			query = server.storagesService.applyFilters(query, {
				options,
				formatMapping,
				optionsDictionary
			});

			query = server.storagesService.applySorting(query, { sort, sortDictionary });

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

		applyFilters: (query, filterData) => {
			const { options, formatMapping, optionsDictionary } = filterData;

			if (!options) {
				return query;
			}

			const filterSubQueries = generateFilterSubquery(options, formatMapping, optionsDictionary);

			return query.where(and(...filterSubQueries));
		},

		applySorting: (query, sortData) => {
			const { sort, sortDictionary } = sortData;

			if (!sort) {
				return query;
			}

			const orderSubqueries = generateOrderSubquery(sort, sortDictionary);

			return query.orderBy(...orderSubqueries);
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
		}
	});
}

export default fp(storagesService);
