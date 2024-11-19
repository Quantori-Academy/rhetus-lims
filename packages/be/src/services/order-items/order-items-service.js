import { eq, inArray } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';
import { ItemTypes } from '../../lib/db/schema/orders-items.js';

const formatMapping = {
	quantityUnit: string => helpers.lowercase(string)
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
						throw new Error('No such request');
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
						throw new Error('Request is already processing in another one order');
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
						throw new Error('No such reagent');
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
			const { reagents, reagentRequests, orderTitle } = data ?? {};

			const [formattedRequests, formattedReagents] = await Promise.all([
				server.orderItemsService.getFormattedOrderItemsFromRequests(reagentRequests),
				server.orderItemsService.getFormattedOrderItemsFromReagents(reagents)
			]);

			const formattedOrderItems = [...formattedRequests, ...formattedReagents];

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
		}
	});
}

export default fp(orderItemsService);
