import fp from 'fastify-plugin';

import * as schema from './orders-schema.js';
import ordersService from '../../services/orders/orders-service.js';
import { OrderStatus } from '../../lib/db/schema/orders.js';

async function orders(server, options) {
	await server.register(ordersService);

	server.route({
		method: 'POST',
		path: options.prefix + 'orders',
		preValidation: [server.authenticate, server.officer],
		schema: schema.createOrder,
		handler: onCreateOrder
	});

	async function onCreateOrder(req, reply) {
		try {
			const authenticatedUserId = Number(req.session.user.id);
			const orderTitle = await server.ordersService.createOrder({
				...req.body,
				userId: authenticatedUserId
			});

			return reply
				.code(201)
				.send({ status: 'success', message: `Order '${orderTitle}' was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'orders/:id',
		preValidation: [server.authenticate, server.officer],
		schema: schema.getOrder,
		handler: onGetOrder
	});

	async function onGetOrder(req, reply) {
		try {
			const orderId = req.params.id;
			const order = await server.ordersService.getOrderById(orderId);

			if (!order) {
				return reply.code(404).send({ status: 'error', message: `No such order` });
			}

			return reply.code(200).send(order);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'orders',
		preValidation: [server.authenticate, server.officer],
		schema: schema.getOrders,
		handler: onGetOrders
	});

	async function onGetOrders(req, reply) {
		try {
			const data = await server.ordersService.getOrders(req.query);

			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'orders/:id',
		preValidation: [server.authenticate, server.officer],
		schema: schema.updateOrder,
		handler: onUpdateOrder
	});

	async function onUpdateOrder(req, reply) {
		try {
			const orderId = req.params.id;

			const { status: orderStatus } = await server.ordersService.getOrderById(orderId);

			if (!orderStatus) {
				return reply.code(404).send({ status: 'error', message: `No such order` });
			}

			if (orderStatus !== OrderStatus.PENDING) {
				return reply
					.code(403)
					.send({ status: 'error', message: `Sorry. You cannot update order while processing` });
			}

			const orderTitle = await server.ordersService.updateOrder(orderId, req.body);
			return reply
				.code(200)
				.send({ status: 'success', message: `Order '${orderTitle}' was updated` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'orders/:id',
		preValidation: [server.authenticate, server.officer],
		schema: schema.deleteOrder,
		handler: onDeleteOrder
	});

	async function onDeleteOrder(req, reply) {
		try {
			const orderId = req.params.id;
			const { status: orderStatus } = await server.ordersService.getOrderById(orderId);

			if (!orderStatus) {
				return reply.code(404).send({ status: 'error', message: `No such order` });
			}

			if (orderStatus !== OrderStatus.PENDING) {
				return reply
					.code(403)
					.send({ status: 'error', message: `Sorry. You cannot delete order while processing` });
			}

			const orderTitle = await server.ordersService.softDeleteOrder(orderId);

			return reply
				.code(200)
				.send({ status: 'success', message: `Order '${orderTitle}' was deleted` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(orders);
