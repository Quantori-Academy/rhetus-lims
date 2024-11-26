import fp from 'fastify-plugin';

import * as schema from './substances-schema.js';
import { helpers } from '../../lib/utils/common/helpers.js';
import substancesService from '../../services/substances/substances-service.js';
import reagentsService from '../../services/reagents/reagents-service.js';
import samplesService from '../../services/samples/samples-service.js';

async function substances(server, options) {
	await server.register(substancesService);
	await server.register(reagentsService);
	await server.register(samplesService);

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
		method: 'PATCH',
		path: options.prefix + 'substances/:id',
		preValidation: [server.authenticate],
		schema: schema.updateSubstance,
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
				return reply
					.code(404)
					.send({ status: 'error', message: `No such ${helpers.lowercase(category)}` });
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

	server.route({
		method: 'GET',
		path: options.prefix + 'substances/history/:category/:id',
		preValidation: [server.authenticate],
		schema: schema.getSubstanceHistorySchema,
		handler: onGetSubstancesHistory
	});

	async function onGetSubstancesHistory(req, reply) {
		try {
			const { category, id } = req.params;
			const substance = await server.substancesService.getSubstanceById(id, category);
			if (!substance) {
				return reply.code(404).send({ status: 'error', message: `No such ${category}` });
			}

			const data = await server.substancesService.getHistoryChanges(id, category);
			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'POST',
		path: options.prefix + 'substances',
		preValidation: [server.authenticate],
		schema: schema.createSubstance,
		handler: onCreateSubstance
	});

	async function onCreateSubstance(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const { category, storageId, structure, components } = req.body;

			const storage = await server.storagesService.getStorageById(storageId);

			if (!storage) {
				return reply.code(400).send({ status: 'error', message: `No such storage location` });
			}

			const isStructureValid = await server.substancesService.isStructureValid(structure || '');

			if (!isStructureValid) {
				return reply.code(400).send({ status: 'error', message: `Invalid structure` });
			}

			const areComponentsInsufficient = await server.substancesService.areComponentsInsufficient(
				components,
				category
			);

			if (areComponentsInsufficient) {
				return reply.code(400).send({ status: 'error', message: `Not enough components left` });
			}

			const substanceName = await server.substancesService.createSubstance({
				...req.body,
				userId: authenticatedUserId
			});

			return reply.code(201).send({
				status: 'success',
				message: `${helpers.capitalize(category)} '${substanceName}' was created`
			});
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'substances/:category/:id',
		preValidation: [server.authenticate],
		schema: schema.deleteSubstance,
		handler: onDeleteSubstance
	});

	async function onDeleteSubstance(req, reply) {
		try {
			const { category, id } = req.params;

			const substance = await server.substancesService.getSubstanceById(id, category);

			if (!substance) {
				return reply
					.code(404)
					.send({ status: 'error', message: `No such ${helpers.lowercase(category)}` });
			}

			const substanceName = await server.substancesService.softDeleteSubstance(id, category);

			return reply.code(200).send({
				status: 'success',
				message: `${helpers.capitalize(category)} '${substanceName}' was deleted`
			});
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'substances/:category/:id',
		preValidation: [server.authenticate],
		schema: schema.getSubstance,
		handler: onGetSubstance
	});

	async function onGetSubstance(req, reply) {
		try {
			const { category, id } = req.params;
			const substance = await server.substancesService.getSubstanceById(id, category);

			if (!substance) {
				return reply
					.code(404)
					.send({ status: 'error', message: `No such ${helpers.lowercase(category)}` });
			}

			return reply.code(200).send(substance);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(substances);
