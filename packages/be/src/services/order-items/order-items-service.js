import { eq, inArray, and } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';
import { ItemTypes } from '../../lib/db/schema/orders-items.js';

const formatMapping = {
	quantityUnit: string => helpers.lowercase(string),
	name: string => helpers.capitalize(string),
	casNumber: string => helpers.lowercase(string),
	reagentName: string => helpers.capitalize(string)
};

async function orderItemsService(server) {
	server.decorate('orderItemsService', {
		getFormattedOrderItemsFromRequests: async requests => {
			if (!requests.length) {
				return [];
			}

			const formattedRequests = await Promise.all(
				requests.map(async ({ id, amount, quantityUnit, quantity }) => {
					const request = await server.requestsService.getRequestById(id);

					if (!request) {
						const error = new Error('No such request');
						error.statusCode = 404;
						throw error;
					}

					const {
						status,
						reagentName,
						structure,
						casNumber,
						producer,
						catalogId,
						catalogLink,
						unitPrice
					} = request ?? {};

					if (status !== RequestStatus.PENDING) {
						const error = new Error('Request is already processing in another order');
						error.statusCode = 409;
						throw error;
					}

					return {
						requestId: id,
						reagentName,
						structure,
						casNumber,
						producer,
						catalogId,
						catalogLink,
						unitPrice,
						quantity,
						quantityUnit: formatMapping.quantityUnit(quantityUnit),
						amount,
						itemType: ItemTypes.REQUEST
					};
				})
			);

			return formattedRequests;
		},

		getFormattedOrderItemsFromReagents: async reagents => {
			if (!reagents.length) {
				return [];
			}

			const formattedReagents = await Promise.all(
				reagents.map(async ({ id, amount, quantityUnit, quantity }) => {
					const reagent = await server.reagentsService.getReagentById(id);

					if (!reagent) {
						const error = new Error('No such reagent');
						error.statusCode = 404;
						throw error;
					}

					const { name, structure, casNumber, producer, catalogId, catalogLink, unitPrice } =
						reagent ?? {};

					return {
						reagentName: name,
						structure,
						casNumber,
						producer,
						catalogId,
						catalogLink,
						unitPrice,
						quantity,
						quantityUnit: formatMapping.quantityUnit(quantityUnit),
						amount,
						itemType: ItemTypes.REAGENT
					};
				})
			);

			return formattedReagents;
		},

		getFormattedOrderItemsFromNewReagents: async reagents => {
			if (!reagents.length) {
				return [];
			}

			const formattedReagents = await Promise.all(
				reagents.map(async reagent => {
					const { name, casNumber, quantityUnit, structure, ...restProperties } = reagent;

					const isStructureValid = await server.substancesService.isStructureValid(structure || '');

					if (!isStructureValid) {
						const error = new Error('Invalid structure');
						error.statusCode = 400;
						throw error;
					}

					return {
						reagentName: formatMapping.name(name),
						casNumber: formatMapping.casNumber(casNumber),
						quantityUnit: formatMapping.quantityUnit(quantityUnit),
						structure,
						itemType: ItemTypes.REAGENT,
						...restProperties
					};
				})
			);

			return formattedReagents;
		},

		orderItemsInsert: async (orderId, orderItems, tx) => {
			return Promise.all(
				orderItems.map(async orderItem => {
					const {
						requestId,
						reagentName,
						structure,
						casNumber,
						producer,
						catalogId,
						catalogLink,
						unitPrice,
						quantity,
						quantityUnit,
						amount,
						itemType
					} = orderItem ?? {};

					if (itemType === ItemTypes.REQUEST) {
						await tx
							.update(schema.requests)
							.set({
								requestStatus: RequestStatus.ORDERED,
								orderId
							})
							.where(eq(schema.requests.id, requestId));
					}

					await tx.insert(schema.ordersItems).values({
						orderId,
						requestId,
						itemType,
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
					});
				})
			);
		},

		disableOrderItems: async (orderId, tx) => {
			return tx
				.update(schema.ordersItems)
				.set({ deleted: true })
				.where(eq(schema.ordersItems.orderId, orderId));
		},

		addItemsToOrder: async (orderId, data) => {
			const { reagents, reagentRequests, newReagents, orderTitle } = data ?? {};

			const [formattedRequests, formattedReagents, formattedNewReagents] = await Promise.all([
				server.orderItemsService.getFormattedOrderItemsFromRequests(reagentRequests),
				server.orderItemsService.getFormattedOrderItemsFromReagents(reagents),
				server.orderItemsService.getFormattedOrderItemsFromNewReagents(newReagents)
			]);

			const formattedOrderItems = [
				...formattedRequests,
				...formattedReagents,
				...formattedNewReagents
			];

			await server.db.transaction(async tx => {
				await server.orderItemsService.orderItemsInsert(orderId, formattedOrderItems, tx);
			});

			return orderTitle;
		},

		removeItemsFromOrder: async data => {
			const { reagents, reagentRequests, orderTitle } = data ?? {};

			if (reagentRequests.length) {
				await server.db.transaction(async tx => {
					const requestsIds = await tx
						.delete(schema.ordersItems)
						.where(inArray(schema.ordersItems.tempId, reagentRequests))
						.returning({ requestId: schema.ordersItems.requestId });

					const requestIdsForUpdate = requestsIds.map(({ requestId }) => requestId);

					await tx
						.update(schema.requests)
						.set({ requestStatus: RequestStatus.PENDING, orderId: null })
						.where(inArray(schema.requests.id, requestIdsForUpdate));
				});
			}

			if (reagents.length) {
				await server.db
					.delete(schema.ordersItems)
					.where(inArray(schema.ordersItems.tempId, reagents));
			}

			return orderTitle;
		},

		getOrderItemByTempId: async tempId => {
			const result = await server.db
				.select()
				.from(schema.ordersItems)
				.where(and(eq(schema.ordersItems.tempId, tempId), eq(schema.ordersItems.deleted, false)));

			return result[0];
		},

		updateOrderItem: async (existingItem, data) => {
			const isStructureValid = await server.substancesService.isStructureValid(
				data.structure || ''
			);

			if (!isStructureValid) {
				const error = new Error('Invalid structure');
				error.statusCode = 400;
				throw error;
			}

			const dataForUpdate = Object.fromEntries(
				Object.entries(data)
					.map(([key, value]) => {
						const formattedIncomingValue = Object.keys(formatMapping).includes(key)
							? formatMapping[key](value)
							: value;

						if (existingItem[key] === formattedIncomingValue) {
							return;
						}

						return [key, formattedIncomingValue];
					})
					.filter(Boolean)
			);

			if (!Object.keys(dataForUpdate).length) {
				const error = new Error(
					'There is nothing to update. Check sending values or order item state.'
				);
				error.statusCode = 400;
				throw error;
			}

			return server.db
				.update(schema.ordersItems)
				.set(dataForUpdate)
				.where(eq(schema.ordersItems.tempId, existingItem.tempId));
		}
	});
}

export default fp(orderItemsService);
