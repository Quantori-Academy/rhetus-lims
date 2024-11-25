import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { eq, or } from 'drizzle-orm';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';

async function notificationsService(server) {
	server.decorate('notificationsService', {
		addNotification: async data => {
			const { requestId, orderId, message } = data;

			await server.db
				.insert(schema.notifications)
				.values({ message, requestId: requestId ?? null, orderId: orderId ?? null });
		},

		getNotifications: async (userId, queryParams) => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			let query = server.db
				.selectDistinct({
					id: schema.notifications.id,
					orderId: schema.notifications.orderId,
					requestId: schema.notifications.requestId,
					message: schema.notifications.message,
					createdAt: schema.notifications.createdAt
				})
				.from(schema.notifications)
				.leftJoin(
					schema.requests,
					or(
						eq(schema.notifications.requestId, schema.requests.id),
						eq(schema.notifications.orderId, schema.requests.orderId)
					)
				)
				.leftJoin(schema.orders, eq(schema.notifications.orderId, schema.orders.id))
				.where(or(eq(schema.requests.userId, userId), eq(schema.orders.userId, userId)))
				.orderBy(schema.notifications.id);

			query = applyFilters(query, options, 'notifications');
			query = applySorting(query, sort, 'notifications');

			const count = await query;
			const notifications = await query.limit(limit).offset(offset);

			return {
				notifications,
				count: count.length
			};
		}
	});
}

export default fp(notificationsService);
