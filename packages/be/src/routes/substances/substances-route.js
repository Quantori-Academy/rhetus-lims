import fp from 'fastify-plugin';

import * as schema from './substances-schema.js';
import substancesService from '../../services/substances/substances-service.js';

async function substances(server, options) {
	await server.register(substancesService);

	server.route({
		method: 'GET',
		path: options.prefix + 'substances',
		preValidation: [server.authenticate],
		schema: schema.getSubstances,
		handler: onGetSubstances
	});

	async function onGetSubstances(req, reply) {
		try {
			const data = await server.substancesService.getSubstances(req.query);

			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'PUT',
		path: options.prefix + 'substances/quantity-change/:id',
		preValidation: [server.authenticate],
		schema: schema.changeQuantity,
		handler: onQuantityChange
	});

	async function onQuantityChange(req, reply) {
		try {
			const { category } = req.body;

			const substanceId = req.params.id;
			const substance = server.reagentsService.getReagentById(substanceId);
			// TODO: add sample checking after it will be implemented
			// category === 'reagent'
			// 	? server.reagentsService.getReagentById(substanceId)
			// 	: server.samplesService.getSampleById(substanceId);

			if (!substance) {
				return reply.code(404).send({ status: 'error', message: `No such ${category}` });
			}

			const { code, status, message } = await server.substancesService.changeSubstanceQuantity(
				substanceId,
				{
					...req.body,
					userId: req.session.user.id
				}
			);

			return reply.code(code).send({
				status,
				message
			});
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(substances);
