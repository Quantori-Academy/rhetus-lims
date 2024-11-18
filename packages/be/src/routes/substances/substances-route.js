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
			const { category, quantityUsed, reason } = req.body;

			const substanceId = req.params.id;
			const substance = await server.substancesService.getSubstanceById(substanceId, category);

			if (!substance) {
				return reply.code(404).send({ status: 'error', message: `No such ${category}` });
			}

			const canQuantityChange = await server.substancesService.canQuantityChange(
				substanceId,
				req.body
			);

			if (!canQuantityChange) {
				return reply.code(409).send({
					status: 'error',
					message: `Quantity of ${category} '${substance.name}' cannot be changed. Check sending values`
				});
			}

			const { code, status, message } = await server.substancesService.changeSubstanceQuantity(
				substanceId,
				{
					category,
					quantityUsed,
					reason,
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

	server.route({
		method: 'PATCH',
		path: options.prefix + 'substances/:id',
		preValidation: [server.authenticate],
		schema: schema.updateSubstanceSchema,
		handler: onSubstanceUpdate
	});

	async function onSubstanceUpdate(req, reply) {
		try {
			const { category, ...updates } = req.body;

			if (Object.keys(updates).length === 0) {
				return reply.code(200).send({ status: 'info', message: 'Nothing to update' });
			}
			const substanceId = req.params.id;
			const substance = await server.substancesService.getSubstanceById(substanceId, category);
			if (!substance) {
				return reply.code(404).send({ status: 'error', message: `No such ${category}` });
			}

			const { isValid, codeStatus, errorMessage, updatedData } =
				await server.substancesService.validateSubstanceUpdateInput(
					substanceId,
					req.body,
					req.session.user.id
				);

			if (!isValid) {
				return reply.code(codeStatus).send({ status: 'error', message: errorMessage });
			}
			const { code, status, message } = await server.substancesService.updateSubstance(
				substanceId,
				updatedData
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
