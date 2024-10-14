import { eq, and, sql } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';

const formatMapping = {
	name: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`,
	casNumber: string => string.toLowerCase(),
	quantityUnit: string => string.toLowerCase()
};

async function reagentsService(server) {
	server.decorate('reagentsService', {
		createReagent: async data => {
			const {
				name,
				casNumber,
				producer,
				catalogId,
				catalogLink,
				unitPrice,
				quantityUnit,
				quantity,
				quantityLeft,
				expirationDate,
				storageLocationId,
				description
			} = data;

			const result = await server.db
				.insert(schema.reagents)
				.values({
					name: formatMapping.name(name),
					casNumber: formatMapping.casNumber(casNumber),
					producer,
					catalogId,
					catalogLink,
					unitPrice,
					quantityUnit: formatMapping.quantityUnit(quantityUnit),
					quantity,
					quantityLeft,
					expirationDate: new Date(expirationDate),
					storageLocationId,
					description
				})
				.returning({ name: schema.reagents.name });

			return result.length ? result[0].name : null;
		},

		getReagentById: async id => {
			const result = await server.db
				.select({
					id: schema.reagents.id,
					name: schema.reagents.name,
					casNumber: schema.reagents.casNumber,
					producer: schema.reagents.producer,
					catalogId: schema.reagents.catalogId,
					catalogLink: schema.reagents.catalogLink,
					unitPrice: schema.reagents.unitPrice,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					description: schema.reagents.description
					// storageLocation: {
					// 	id: schema.locations.id,
					// 	name: schema.locations.name
					// }
				})
				.from(schema.reagents)
				// TODO: add join with storages when it will be implemented and change in select
				.where(and(eq(schema.reagents.id, id), eq(schema.reagents.deleted, false)));

			return result[0];
		},

		softDeleteReagent: async id => {
			const result = await server.db
				.update(schema.reagents)
				.set({
					deleted: true
				})
				.where(eq(schema.reagents.id, id))
				.returning({ name: schema.reagents.name });

			return result.length ? result[0].name : null;
		},

		getReagentsQuery: () => {
			// TODO: add join with storages when it will be implemented and change in select
			// TODO: add structure whet it will be implemented in next milestones
			return server.db
				.select({
					id: schema.reagents.id,
					name: schema.reagents.name,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					storageLocationId: schema.reagents.storageLocationId,
					description: schema.reagents.description,
					category: sql`'reagent'`.as('category')
				})
				.from(schema.reagents)
				.where(eq(schema.reagents.deleted, false));
		}
	});
}

export default fp(reagentsService);
