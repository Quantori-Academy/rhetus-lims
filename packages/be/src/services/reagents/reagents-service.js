import { eq, and, sql, aliasedTable } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import { smilesToMol } from '../../lib/db/structure/utils/smiles-to-mol.js';

const formatMapping = {
	name: string => helpers.capitalize(string),
	casNumber: string => helpers.lowercase(string),
	quantityUnit: string => helpers.lowercase(string)
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
				storageId,
				description,
				structure
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
					storageId,
					description,
					...(structure && { structure: smilesToMol(structure) })
				})
				.returning({ name: schema.reagents.name });

			return result.length ? result[0].name : null;
		},

		getReagentById: async id => {
			const baseQuery = server.reagentsService.getBaseReagentQuery();
			const result = await baseQuery.where(
				and(eq(schema.reagents.id, id), eq(schema.reagents.deleted, false))
			);
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

		getReagentsQuery: (extras = {}) => {
			const baseQuery = server.reagentsService.getBaseReagentsQuery(extras);
			return baseQuery
				.innerJoin(schema.storages, eq(schema.storages.id, schema.reagents.storageId))
				.leftJoin(schema.ordersReagents, eq(schema.ordersReagents.reagentId, schema.reagents.id))
				.where(eq(schema.reagents.deleted, false));
		},

		changeQuantity: async (id, data) => {
			const { userId, quantityUsed, reason } = data;

			const { quantityLeft, quantityUnit } = await server.reagentsService.getReagentById(id);

			const targetValue = quantityLeft - quantityUsed;

			await server.db.insert(schema.substancesHistory).values({
				userId,
				reagentId: id,
				previousValue: quantityLeft,
				targetValue,
				quantityUnit,
				changeReason: reason,
				actionType: 'quantity-update'
			});

			const result = await server.db
				.update(schema.reagents)
				.set({
					quantityLeft: targetValue
				})
				.where(eq(schema.reagents.id, id))
				.returning({
					reagentName: schema.reagents.name
				});

			if (targetValue === 0) {
				await server.reagentsService.softDeleteReagent(id);
			}

			return {
				code: 200,
				status: 'success',
				message: `Quantity of reagent '${result[0].reagentName}' was changed`
			};
		},

		getReagentsByStorageId: async id => {
			return await server.db
				.select({
					id: schema.reagents.id,
					name: schema.reagents.name,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					description: schema.reagents.description,
					category: sql`'reagent'`.as('category'),
					structure: schema.reagents.structure
				})
				.from(schema.reagents)
				.where(and(eq(schema.reagents.storageId, id), eq(schema.reagents.deleted, false)));
		},

		changeStorage: async (id, data) => {
			const { storageId, userId } = data;

			const reagent = await server.reagentsService.getReagentById(id);

			await server.db.insert(schema.substancesHistory).values({
				reagentId: id,
				userId,
				previousStorageId: reagent.storageLocation.id,
				targetStorageId: storageId,
				actionType: 'storage-update'
			});

			const result = await server.db
				.update(schema.reagents)
				.set({ storageId })
				.where(eq(schema.reagents.id, id))
				.returning({ reagentName: schema.reagents.name });

			return {
				code: 200,
				status: 'success',
				message: `Storage location of reagent '${result[0].reagentName}' was changed`
			};
		},

		changeName: async (id, data) => {
			const { name } = data;

			const result = await server.db
				.update(schema.reagents)
				.set({ name })
				.where(eq(schema.reagents.id, id))
				.returning({ reagentName: schema.reagents.name });

			return {
				code: 200,
				status: 'success',
				message: `Name of the reagent was changed to '${result[0].reagentName}'`
			};
		},

		changeDescription: async (id, data) => {
			const { description } = data;

			const result = await server.db
				.update(schema.reagents)
				.set({ description })
				.where(eq(schema.reagents.id, id))
				.returning({ reagentName: schema.reagents.name });

			return {
				code: 200,
				status: 'success',
				message: `Description of reagent '${result[0].reagentName}' was changed`
			};
		},

		createReagentsFromOrder: async (orderId, tx) => {
			const orderItems = await tx
				.select()
				.from(schema.ordersItems)
				.where(eq(schema.ordersItems.orderId, orderId));

			if (!orderItems.length) {
				return null;
			}

			const promises = [];

			orderItems.forEach(item => {
				const {
					reagentName,
					structure,
					casNumber,
					producer,
					catalogId,
					catalogLink,
					unitPrice,
					quantityUnit,
					quantity,
					amount
				} = item;

				for (let count = 0; count < amount; count += 1) {
					promises.push(
						tx
							.insert(schema.reagents)
							.values({
								name: reagentName,
								structure,
								casNumber,
								producer,
								catalogId,
								catalogLink,
								unitPrice: unitPrice || 0,
								quantityUnit,
								quantity,
								quantityLeft: quantity,
								storageId: null
							})
							.returning({ reagentId: schema.reagents.id })
					);
				}
			});

			const reagentsWithIds = await Promise.all(promises);

			return reagentsWithIds.map(([{ reagentId }]) => reagentId);
		},

		getReagentsFromOrder: async orderId => {
			const reagents = await server.db
				.select({
					reagentId: schema.reagents.id
				})
				.from(schema.reagents)
				.leftJoin(schema.ordersReagents, eq(schema.ordersReagents.reagentId, schema.reagents.id))
				.leftJoin(schema.orders, eq(schema.orders.id, schema.ordersReagents.orderId))
				.where(eq(schema.ordersReagents.orderId, orderId));

			return reagents.length ? reagents : null;
		},

		getHistory: async substanceId => {
			const prevStorage = aliasedTable(schema.storages, 'prevStorage');
			const newStorage = aliasedTable(schema.storages, 'newStorage');
			return await server.db
				.select({
					id: sql`${schema.substancesHistory.id}`.as('historyId'),
					user: {
						userId: schema.users.id,
						userFirstName: schema.users.firstName,
						userLastName: schema.users.lastName
					},
					prevQuantityLeft: schema.substancesHistory.previousValue,
					newQuantityLeft: schema.substancesHistory.targetValue,
					quantityUnit: schema.substancesHistory.quantityUnit,
					prevStorageLocation: sql`CASE
						WHEN ${prevStorage}.id IS NOT NULL THEN json_build_object(
							'prevStorageId', ${prevStorage}.id,
							'prevStorageRoom', ${prevStorage}.room,
							'prevStorageName', ${prevStorage}.name
						)
						ELSE NULL
						END`.as('prevStorageLocation'),
					newStorageLocation: sql`CASE
						WHEN ${newStorage}.id IS NOT NULL THEN json_build_object(
							'newStorageId', ${newStorage}.id,
							'newStorageRoom', ${newStorage}.room,
							'newStorageName', ${newStorage}.name
						)
						ELSE NULL
						END`.as('newStorageLocation'),
					actionType: schema.substancesHistory.actionType,
					changeReason: schema.substancesHistory.changeReason,
					isDeleted: schema.substancesHistory.isDeleted,
					modifiedDate: schema.substancesHistory.createdAt
				})
				.from(schema.substancesHistory)
				.innerJoin(schema.users, eq(schema.substancesHistory.userId, schema.users.id))
				.leftJoin(prevStorage, eq(prevStorage.id, schema.substancesHistory.previousStorageId))
				.leftJoin(newStorage, eq(newStorage.id, schema.substancesHistory.targetStorageId))
				.where(eq(schema.substancesHistory.reagentId, substanceId))
				.orderBy(schema.substancesHistory.createdAt, 'asc');
		},

		addStorageToReagentFromOrder: async (reagentId, storageId, userId) => {
			const storage = await server.storagesService.getStorageById(storageId);
			if (!storage) {
				const error = new Error(`No such storage location with id: ${storageId} found`);
				error.statusCode = 404;
				throw error;
			}

			await server.db.transaction(async tx => {
				await tx
					.update(schema.reagents)
					.set({ storageId })
					.where(eq(schema.reagents.id, reagentId));

				await tx.insert(schema.substancesHistory).values({
					reagentId,
					userId,
					previousStorageId: null,
					targetStorageId: storageId,
					actionType: 'storage-update'
				});
			});
		},

		getBaseReagentsQuery: extras => {
			return server.db
				.select({
					id: schema.reagents.id,
					name: schema.reagents.name,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					storageLocation: {
						id: sql`${schema.storages.id}`.as('storageId'),
						name: sql`${schema.storages.name}`.as('storageName'),
						room: sql`${schema.storages.room}`.as('storageRoom'),
						description: sql`${schema.storages.description}`.as('storageDescription')
					},
					structure: schema.reagents.structure,
					description: schema.reagents.description,
					category: sql`'reagent'`.as('category'),
					createdAt: schema.reagents.createdAt,
					orderId: schema.ordersReagents.orderId,
					...Object.fromEntries(
						Object.entries(extras).map(([col, query]) => [
							col,
							query === 'schema' ? schema.reagents[col] : query
						])
					)
				})
				.from(schema.reagents);
		},

		getReagentsQueryForOrders: (extras = {}) => {
			const baseQuery = server.reagentsService.getBaseReagentsQuery(extras);
			return baseQuery
				.leftJoin(schema.storages, eq(schema.storages.id, schema.reagents.storageId))
				.leftJoin(schema.ordersReagents, eq(schema.ordersReagents.reagentId, schema.reagents.id))
				.where(eq(schema.reagents.deleted, false));
		},

		getBaseReagentQuery: () => {
			return server.db
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
					structure: schema.reagents.structure,
					storageLocation: {
						id: schema.storages.id,
						room: schema.storages.room,
						name: schema.storages.name,
						description: schema.storages.description
					},
					category: sql`'reagent'`.as('category')
				})
				.from(schema.reagents)
				.innerJoin(schema.storages, eq(schema.reagents.storageId, schema.storages.id));
		},

		getDeletedReagentById: async id => {
			const baseQuery = server.reagentsService.getBaseReagentQuery();
			const result = await baseQuery.where(
				and(eq(schema.reagents.id, id), eq(schema.reagents.deleted, true))
			);

			return result[0];
		}
	});
}

export default fp(reagentsService);
