import { eq, and, getTableColumns, inArray } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';

const formatMapping = {
	title: string => helpers.capitalize(string),
	seller: string => helpers.capitalize(string),
	name: string => helpers.capitalize(string),
	casNumber: string => helpers.lowercase(string),
	quantityUnit: string => helpers.lowercase(string)
};

async function ordersService(server) {
	server.decorate('ordersService', {
		createOrder: async data => {
			const { title, seller, reagents, reagentRequests, userId } = data;

			const formattedRequests = reagentRequests.map(async request => {
				const { id, quantityUnit, ...restInfo } = request;
				const { reagentName, structure, casNumber } =
					await server.requestsService.getRequestById(id);

				return {
					...restInfo,
					id,
					name: reagentName,
					structure,
					casNumber,
					quantityUnit: formatMapping.quantityUnit(quantityUnit),
					itemType: 'request'
				};
			});

			const formattedReagents = reagents.map(reagent => {
				const formattedReagent = Object.fromEntries(
					Object.entries(reagent).map(([key, value]) => {
						return key in formatMapping ? [key, formatMapping[key](value)] : [key, value];
					})
				);

				return { ...formattedReagent, itemType: 'reagent' };
			});

			const createdOrderTitle = await server.db.transaction(async tx => {
				const [{ orderId, orderTitle }] = await tx
					.insert(schema.orders)
					.values({
						title: formatMapping.title(title),
						userId,
						seller: formatMapping.seller(seller)
					})
					.returning({ orderId: schema.orders.id, orderTitle: schema.orders.title });

				for await (const item of [...formattedRequests, ...formattedReagents]) {
					const {
						id: requestId,
						itemType,
						name: reagentName,
						structure,
						casNumber,
						producer,
						catalogId,
						catalogLink,
						unitPrice,
						quantityUnit,
						quantity,
						amount
					} = item ?? {};

					if (itemType === 'request') {
						await tx
							.update(schema.requests)
							.set({
								requestStatus: 'ordered',
								orderId
							})
							.where(eq(schema.requests.id, item.id));
					}

					await tx.insert(schema.ordersItems).values({
						orderId,
						requestId,
						itemType,
						reagentName: formatMapping.name(reagentName),
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
				}

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

			// eslint-disable-next-line no-unused-vars
			const { requestId, orderId, itemType, createdAt, updatedAt, deleted, ...restColumns } =
				getTableColumns(schema.ordersItems);

			const reagents = await server.db
				.select({ ...restColumns })
				.from(schema.ordersItems)
				.innerJoin(schema.orders, eq(schema.orders.id, schema.ordersItems.orderId))
				.where(eq(schema.ordersItems.itemType, 'reagent'));
			const reagentRequests = await server.db
				.select({ ...restColumns })
				.from(schema.ordersItems)
				.innerJoin(schema.orders, eq(schema.orders.id, schema.ordersItems.orderId))
				.where(eq(schema.ordersItems.itemType, 'request'));

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
					and(eq(schema.ordersItems.orderId, orderId), eq(schema.ordersItems.itemType, 'request'))
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
