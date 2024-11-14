import { eq, and, getTableColumns, inArray } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';
import { ItemTypes } from '../../lib/db/schema/orders-items.js';

const formatMapping = {
	title: string => helpers.capitalize(string),
	seller: string => helpers.capitalize(string),
	casNumber: string => helpers.lowercase(string),
	quantityUnit: string => helpers.lowercase(string)
};

async function ordersService(server) {
	server.decorate('ordersService', {
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

		orderItemsInsert: async (tx, orderItems, orderId) => {
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
								// TODO: change status after requests implementation will be updated
								requestStatus: 'ordered',
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

		createOrder: async data => {
			const { title, seller, reagents, reagentRequests, userId } = data;

			const [formattedRequests, formattedReagents] = await Promise.all([
				server.ordersService.getFormattedOrderItemsFromRequests(reagentRequests),
				server.ordersService.getFormattedOrderItemsFromReagents(reagents)
			]);

			const formattedOrderItems = [...formattedRequests, ...formattedReagents];

			const createdOrderTitle = await server.db.transaction(async tx => {
				const [{ orderId, orderTitle }] = await tx
					.insert(schema.orders)
					.values({
						title: formatMapping.title(title),
						userId,
						seller: formatMapping.seller(seller)
					})
					.returning({ orderId: schema.orders.id, orderTitle: schema.orders.title });

				await server.ordersService.orderItemsInsert(tx, formattedOrderItems, orderId);

				return orderTitle;
			});

			return createdOrderTitle;
		},

		getOrderById: async reqOrderId => {
			const [order] = await server.db
				.select({
					id: schema.orders.id,
					title: schema.orders.title,
					seller: schema.orders.seller,
					createdAt: schema.orders.createdAt,
					updatedAt: schema.orders.updatedAt,
					status: schema.orders.orderStatus,
					author: {
						id: schema.users.id,
						username: schema.users.username
					}
				})
				.from(schema.orders)
				.innerJoin(schema.users, eq(schema.orders.userId, schema.users.id))
				.where(and(eq(schema.orders.id, reqOrderId), eq(schema.orders.deleted, false)));

			if (!order) {
				return null;
			}

			// eslint-disable-next-line no-unused-vars
			const { requestId, orderId, itemType, createdAt, updatedAt, deleted, ...restColumns } =
				getTableColumns(schema.ordersItems);

			const [reagents, reagentRequests] = await Promise.all([
				server.db
					.select({ ...restColumns })
					.from(schema.ordersItems)
					.where(
						and(
							eq(schema.ordersItems.orderId, reqOrderId),
							eq(schema.ordersItems.itemType, ItemTypes.REAGENT)
						)
					),
				server.db
					.select({ ...restColumns })
					.from(schema.ordersItems)
					.where(
						and(
							eq(schema.ordersItems.orderId, reqOrderId),
							eq(schema.ordersItems.itemType, ItemTypes.REQUEST)
						)
					)
			]);

			return { ...order, reagents, reagentRequests };
		},

		getOrders: async queryParams => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			let query = server.db
				.select({
					id: schema.orders.id,
					title: schema.orders.title,
					seller: schema.orders.seller,
					createdAt: schema.orders.createdAt,
					updatedAt: schema.orders.updatedAt,
					status: schema.orders.orderStatus,
					author: {
						id: schema.users.id,
						username: schema.users.username
					}
				})
				.from(schema.orders)
				.innerJoin(schema.users, eq(schema.orders.userId, schema.users.id));

			query = applyFilters(query, { ...options, deleted: 'false' }, 'orders');
			query = applySorting(query, sort, 'orders');

			const count = await query;
			const orders = await query.limit(limit).offset(offset);

			return {
				orders,
				count: count.length
			};
		},

		updateOrder: async (id, data) => {
			const dataForUpdate = Object.fromEntries(
				Object.entries(data).map(([key, value]) =>
					!Object.keys(formatMapping).includes(key)
						? [key, value]
						: [key, formatMapping[key](value)]
				)
			);

			const result = await server.db
				.update(schema.orders)
				.set(dataForUpdate)
				.where(eq(schema.orders.id, id))
				.returning({ orderTitle: schema.orders.title });

			return result.length ? result[0].orderTitle : null;
		},

		softDeleteOrder: async id => {
			const deletedOrderTitle = await server.db.transaction(async tx => {
				const [{ orderTitle }] = await tx
					.update(schema.orders)
					.set({
						deleted: true
					})
					.where(eq(schema.orders.id, id))
					.returning({ orderTitle: schema.orders.title });

				await server.ordersService.resetOrdersItems(tx, id);

				return orderTitle;
			});

			return deletedOrderTitle;
		},

		resetOrdersItems: async (tx, orderId) => {
			const requestsIds = await tx
				.delete(schema.ordersItems)
				.where(
					and(
						eq(schema.ordersItems.orderId, orderId),
						eq(schema.ordersItems.itemType, ItemTypes.REQUEST)
					)
				)
				.returning({ requestId: schema.ordersItems.requestId });

			if (requestsIds.length) {
				const requestIdsForUpdate = requestsIds.map(({ requestId }) => requestId);

				await tx
					.update(schema.requests)
					.set({ requestStatus: RequestStatus.PENDING, orderId: null })
					.where(inArray(schema.requests.id, requestIdsForUpdate));
			}

			await tx.delete(schema.ordersItems).where(eq(schema.ordersItems.orderId, orderId));
		}
	});
}

export default fp(ordersService);
