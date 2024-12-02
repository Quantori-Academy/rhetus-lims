import { eq, and, getTableColumns, inArray, sql } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';
import { ItemTypes } from '../../lib/db/schema/orders-items.js';
import { OrderStatus } from '../../lib/db/schema/orders.js';

const formatMapping = {
	title: string => helpers.capitalize(string),
	seller: string => helpers.capitalize(string)
};

const OrderStatusActions = {
	NEXT: 'next',
	CANCEL: 'cancel'
};

async function ordersService(server) {
	server.decorate('ordersService', {
		createOrder: async data => {
			const { title, seller, reagents, reagentRequests, newReagents, userId } = data;

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

			const { orderTitle: createdOrderTitle, orderId: createdOrderId } =
				await server.db.transaction(async tx => {
					const [{ orderId, orderTitle }] = await tx
						.insert(schema.orders)
						.values({
							title: formatMapping.title(title),
							userId,
							seller: formatMapping.seller(seller)
						})
						.returning({ orderId: schema.orders.id, orderTitle: schema.orders.title });

					await server.orderItemsService.orderItemsInsert(orderId, formattedOrderItems, tx, userId);

					return { orderTitle, orderId };
				});

			await server.notificationsService.addNotification({
				orderId: createdOrderId,
				message: `New order '${createdOrderTitle}' created for ${formattedOrderItems.length} item${formattedOrderItems.length > 1 ? 's' : ''} that includes your requests.`
			});

			await server.ordersService.insertStatusInHistory(createdOrderId, OrderStatus.PENDING, userId);

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

		softDeleteOrder: async (id, userId) => {
			const deletedOrderTitle = await server.db.transaction(async tx => {
				const [{ orderTitle }] = await tx
					.update(schema.orders)
					.set({
						deleted: true
					})
					.where(eq(schema.orders.id, id))
					.returning({ orderTitle: schema.orders.title });

				await server.ordersService.resetOrdersItems(id, tx, userId);

				await tx.insert(schema.statusesHistory).values({
					userId,
					orderId: id,
					status: OrderStatus.PENDING,
					isDeleted: true
				});

				return orderTitle;
			});

			return deletedOrderTitle;
		},

		updateOrderStatus: async (orderId, nextStatus, userId, tx = null) => {
			const target = tx ?? server.db;
			const [{ orderTitle }] = await target
				.update(schema.orders)
				.set({
					orderStatus: nextStatus
				})
				.where(eq(schema.orders.id, orderId))
				.returning({ orderTitle: schema.orders.title });

			await server.ordersService.insertStatusInHistory(orderId, nextStatus, userId, tx);

			return orderTitle;
		},

		bindOrderToReagents: async (orderId, reagentIds, tx) => {
			return tx.insert(schema.ordersReagents).values({
				orderId,
				reagentId: sql.raw(`unnest(ARRAY['${reagentIds.join("','")}']::UUID[])`)
			});
		},

		orderStatusChange: async (orderId, statusDataUpdate, userId) => {
			const { action, orderStatus: currentStatus, reagents = [] } = statusDataUpdate;

			const nextStatus = server.ordersService.getNextOrderStatus(currentStatus);
			if (!nextStatus) {
				const error = new Error('Sorry. The status for this order cannot be changed further');
				error.statusCode = 409;
				throw error;
			}

			let orderTitle;

			if (action === OrderStatusActions.NEXT) {
				orderTitle = await server.ordersService.handleNextStatus(
					orderId,
					nextStatus,
					reagents,
					userId
				);
			}

			if (action === OrderStatusActions.CANCEL) {
				if (currentStatus === OrderStatus.FULFILLED) {
					const error = new Error('Sorry. You cannot cancel fulfilled order');
					error.statusCode = 409;
					throw error;
				}
				orderTitle = await server.ordersService.handleCancelOrder(
					orderId,
					OrderStatus.CANCELED,
					userId
				);
			}

			return orderTitle;
		},

		handleNextStatus: async (orderId, nextStatus, reagentsStorageUpdates, userId) => {
			let updatedOrderTitle;
			let orderedReagents;
			const reagentsStoragesUpdateMap = new Map();

			switch (nextStatus) {
				case OrderStatus.ORDERED:
					updatedOrderTitle = await server.ordersService.updateOrderStatus(
						orderId,
						nextStatus,
						userId
					);
					break;
				case OrderStatus.FULFILLED:
					updatedOrderTitle = await server.db.transaction(async tx => {
						const orderTitle = await server.ordersService.updateOrderStatus(
							orderId,
							nextStatus,
							userId,
							tx
						);

						const createdReagentIds = await server.reagentsService.createReagentsFromOrder(
							orderId,
							tx
						);

						await server.ordersService.bindOrderToReagents(orderId, createdReagentIds, tx);

						await server.requestsService.updateRequestStatusByOrder(
							orderId,
							RequestStatus.FULFILLED,
							tx,
							userId
						);

						await server.orderItemsService.disableOrderItems(orderId, tx);

						return orderTitle;
					});

					break;
				case OrderStatus.COMPLETED:
					orderedReagents = await server.reagentsService.getReagentsFromOrder(orderId);

					if (!reagentsStorageUpdates.length) {
						const error = new Error(
							'There is no information about storages for new reagents. Please check sending values in reagents array!'
						);
						error.statusCode = 403;
						throw error;
					}

					if (orderedReagents.length !== reagentsStorageUpdates.length) {
						const error = new Error(
							'There is a mismatch between count of created reagents and count in storage updating list. Please check sending values!'
						);
						error.statusCode = 403;
						throw error;
					}

					reagentsStorageUpdates.forEach(({ id, storageId }) => {
						reagentsStoragesUpdateMap.set(id, storageId);
					});

					await Promise.all(
						orderedReagents.map(async ({ reagentId }) => {
							const storageId = reagentsStoragesUpdateMap.get(reagentId);
							return server.reagentsService.addStorageToReagentFromOrder(
								reagentId,
								storageId,
								userId
							);
						})
					);

					updatedOrderTitle = await server.db.transaction(async tx => {
						const orderTitle = await server.ordersService.updateOrderStatus(
							orderId,
							nextStatus,
							userId,
							tx
						);

						await server.requestsService.updateRequestStatusByOrder(
							orderId,
							RequestStatus.COMPLETED,
							tx,
							userId
						);

						return orderTitle;
					});
					break;
			}

			await server.notificationsService.addNotification({
				orderId,
				message: `Statuses for order '${updatedOrderTitle}' and its requests were updated to '${nextStatus}'.`
			});

			return updatedOrderTitle;
		},

		handleCancelOrder: async (orderId, nextStatus, userId) => {
			const canceledOrderTitle = await server.db.transaction(async tx => {
				const orderTitle = await server.ordersService.updateOrderStatus(
					orderId,
					nextStatus,
					userId,
					tx
				);
				await server.ordersService.resetOrdersItems(orderId, tx, userId);
				return orderTitle;
			});
			await server.notificationsService.addNotification({
				orderId,
				message: `Order '${canceledOrderTitle}' was cancelled.`
			});
			return canceledOrderTitle;
		},

		getNextOrderStatus: currentStatus => {
			switch (currentStatus) {
				case OrderStatus.PENDING:
					return OrderStatus.ORDERED;
				case OrderStatus.ORDERED:
					return OrderStatus.FULFILLED;
				case OrderStatus.FULFILLED:
					return OrderStatus.COMPLETED;
				default:
					return null;
			}
		},

		resetOrdersItems: async (orderId, tx, userId) => {
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

				await Promise.all(
					requestIdsForUpdate.map(requestId =>
						server.requestsService.insertStatusInHistory(
							requestId,
							{ status: RequestStatus.PENDING },
							userId,
							tx
						)
					)
				);
			}

			await tx.delete(schema.ordersItems).where(eq(schema.ordersItems.orderId, orderId));
		},

		insertStatusInHistory: async (orderId, status, userId, tx = null) => {
			const target = tx ?? server.db;
			return await target.insert(schema.statusesHistory).values({
				userId,
				orderId,
				status
			});
		},

		getHistoryChanges: async orderId => {
			const histories = await server.db
				.select({
					id: sql`${schema.statusesHistory.id}`.as('historyId'),
					user: {
						userId: schema.users.id,
						userFirstName: schema.users.firstName,
						userLastName: schema.users.lastName
					},
					status: schema.statusesHistory.status,
					changeReason: schema.statusesHistory.changeReason,
					isDeleted: schema.statusesHistory.isDeleted,
					modifiedDate: schema.statusesHistory.createdAt
				})
				.from(schema.statusesHistory)
				.innerJoin(schema.users, eq(schema.statusesHistory.userId, schema.users.id))
				.where(eq(schema.statusesHistory.orderId, orderId))
				.orderBy(schema.statusesHistory.createdAt, 'asc');

			return { histories };
		}
	});
}

export default fp(ordersService);
