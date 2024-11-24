import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { eq, or } from 'drizzle-orm';

async function notificationsService(server) {
	server.decorate('notificationsService', {
		addNotification: async data => {
			const { requestId, orderId, message } = data;

			await server.db
				.insert(schema.notifications)
				.values({ message, requestId: requestId ?? null, orderId: orderId ?? null });
		},

		getNotifications: async userId => {
			const result = await server.db
				.select({
					id: schema.notifications.id,
					orderId: schema.notifications.orderId,
					requestId: schema.notifications.requestId,
					message: schema.notifications.message,
					createdAt: schema.notifications.createdAt
				})
				.from(schema.notifications)
				.leftJoin(schema.requests, eq(schema.notifications.requestId, schema.requests.id))
				.leftJoin(schema.orders, eq(schema.notifications.orderId, schema.orders.id))
				.where(or(eq(schema.requests.userId, userId), eq(schema.orders.userId, userId)));

			return result;
		}
	});
}

export default fp(notificationsService);
