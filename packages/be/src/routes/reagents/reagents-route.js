import fp from 'fastify-plugin';

import * as schema from './reagents-schema.js';
import reagentsService from '../../services/reagents/reagents-service.js';

async function reagents(server, options) {
	await server.register(reagentsService);

	server.route({
		method: 'POST',
		path: options.prefix + 'reagents',
		preValidation: [server.authenticate],
		schema: schema.createReagent,
		handler: onCreateReagent
	});

	async function onCreateReagent(req, reply) {
		try {
			const isLocationExist = await server.storagesService.getStorageById(
				req.body.storageLocationId
			);

			if (!isLocationExist) {
				return reply.code(404).send({ status: 'error', message: `No such storage location` });
			}

			const reagentName = await server.reagentsService.createReagent(req.body);

			return reply
				.code(201)
				.send({ status: 'success', message: `Reagent '${reagentName}' was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'reagents/:id',
		preValidation: [server.authenticate],
		schema: schema.getReagent,
		handler: onGetReagent
	});

	async function onGetReagent(req, reply) {
		try {
			const reagentUUID = req.params.id;

			const reagent = await server.reagentsService.getReagentById(reagentUUID);

			if (!reagent) {
				return reply.code(404).send({ status: 'error', message: `No such reagent` });
			}

			return reply.code(200).send({ ...reagent, category: 'reagent' });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'reagents/:id',
		preValidation: [server.authenticate],
		schema: schema.deleteReagent,
		handler: onDeleteReagent
	});

	async function onDeleteReagent(req, reply) {
		try {
			const reagentUUID = req.params.id;

			const reagent = await server.reagentsService.getReagentById(reagentUUID);

			if (!reagent) {
				return reply.code(404).send({ status: 'error', message: `No such reagent` });
			}

			const reagentName = await server.reagentsService.softDeleteReagent(reagentUUID);

			return reply
				.code(200)
				.send({ status: 'success', message: `Reagent '${reagentName}' was deleted` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(reagents);
