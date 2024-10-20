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
					storageId: storageLocationId,
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
					description: schema.reagents.description,
					storageLocation: {
						id: schema.storages.id,
						room: schema.storages.room,
						name: schema.storages.name,
						description: schema.storages.description
					}
				})
				.from(schema.reagents)
				.innerJoin(schema.storages, eq(schema.reagents.storageId, schema.storages.id))
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
			return server.db
				.select({
					id: schema.reagents.id,
					name: schema.reagents.name,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					storageLocationId: schema.reagents.storageId,
					description: schema.reagents.description,
					category: sql`'reagent'`.as('category')
				})
				.from(schema.reagents)
				.where(eq(schema.reagents.deleted, false));
		},

		changeReagentQuantity: async (id, data) => {
			const { userId, quantityUsed, quantityLeft: reqQuantityLeft, reason } = data;

			const { quantityLeft, name } = await server.reagentsService.getReagentById(id);

			const diff = quantityLeft - quantityUsed;

			const canQuantityChange = diff >= 0 && diff === reqQuantityLeft;

			if (!canQuantityChange) {
				return {
					code: 409,
					status: 'error',
					message: `Quantity of reagent '${name}' cannot be changed. Check sending values`
				};
			}

			await server.db.insert(schema.substancesQuantityChanges).values({
				userId,
				reagentId: id,
				previousValue: quantityLeft,
				targetValue: reqQuantityLeft,
				changeReason: reason
			});

			const result = await server.db
				.update(schema.reagents)
				.set({
					quantityLeft: reqQuantityLeft
				})
				.where(eq(schema.reagents.id, id))
				.returning({
					reagentName: schema.reagents.name
				});

			if (diff === 0) {
				await server.reagentsService.softDeleteReagent(id);
			}

			return {
				code: 200,
				status: 'success',
				message: `Quantity of reagent '${result[0].reagentName}' was changed`
			};
		}
	});
}

export default fp(reagentsService);
