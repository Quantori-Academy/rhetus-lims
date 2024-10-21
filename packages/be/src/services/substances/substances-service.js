import { and } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/pg-core';
import fp from 'fastify-plugin';
import { generateFilterSubquery } from '../../lib/utils/db/filter-subquery-generator.js';
import { generateOrderSubquery } from '../../lib/utils/db/order-subquery-generator.js';
import { Category } from '../../routes/substances/substances-schema.js';

const formatMapping = {
	name: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`,
	casNumber: string => string.toLowerCase(),
	quantityUnit: string => string.toLowerCase(),
	category: string => string.toLowerCase(),
	storage_id: string => string
};

const optionsDictionary = {
	name: {
		property: 'name',
		schema: 'union'
	},
	category: {
		property: 'category',
		schema: 'union'
	},
	location: {
		property: 'storage_id',
		schema: 'union'
	},
	expirationdate: {
		property: 'expiration_date',
		schema: 'union'
	}
};

const sortDictionary = {
	name: 'name',
	category: 'category',
	location: 'storage_id',
	expirationdate: 'expiration_date'
};

async function substancesService(server) {
	server.decorate('substancesService', {
		getSubstances: async queryParams => {
			const limit = Number(queryParams.limit) || 10;
			const page = Number(queryParams.page) || 1;
			const options = queryParams.options || null;
			const sort = queryParams.sort || null;

			const offset = page === 1 ? 0 : (page - 1) * limit;

			const reagentsQuery = server.reagentsService.getReagentsQuery();
			const samplesQuery = server.samplesService.getSamplesQuery();

			const unionQuery = unionAll(reagentsQuery, samplesQuery);
			let query = server.db.select().from(unionQuery.as('substances'));

			query = server.substancesService.applyFilters(query, {
				options,
				formatMapping,
				optionsDictionary
			});
			query = server.substancesService.applySorting(query, { sort, sortDictionary });

			const count = await query;
			const substances = await query.limit(limit).offset(offset);

			return {
				substances,
				count: count.length
			};
		},

		getSubstanceById: async (id, category) => {
			return category === Category.REAGENT
				? await server.reagentsService.getReagentById(id)
				: await server.samplesService.getSampleById(id);
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

		changeSubstanceQuantity: async (id, data) => {
			const { code, status, message } =
				data.category === Category.REAGENT
					? await server.reagentsService.changeReagentQuantity(id, data)
					: await server.samplesService.changeSampleQuantity(id, data);

			return { code, status, message };
		}
	});
}

export default fp(substancesService);
