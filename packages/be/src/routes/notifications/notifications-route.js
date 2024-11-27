import fp from 'fastify-plugin';
import notificationsService from '../../services/notifications/notifications-service.js';
import * as schema from './notifications-schema.js';

async function notifications(server, options) {
	await server.register(notificationsService);

	server.route({
		method: 'GET',
		path: options.prefix + 'notifications',
		preValidation: [server.authenticate],
		schema: schema.getNotifications,
		handler: noGetNotificationns
	});

	async function noGetNotificationns(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const notifications = await server.notificationsService.getNotifications(
				authenticatedUserId,
				req.query
			);
			return reply.code(200).send(notifications);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(notifications);
