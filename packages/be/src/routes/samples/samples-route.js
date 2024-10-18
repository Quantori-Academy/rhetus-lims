import fp from 'fastify-plugin';
import * as schema from './samples-schema.js';
import samplesService from '../../services/samples/samples-service.js';
import { Category } from '../../lib/db/schema/components.js';

async function samples(server, options) {
	await server.register(samplesService);

	server.route({
		method: 'POST',
		path: options.prefix + 'samples',
		preValidation: [server.authenticate],
		schema: schema.createSample,
		handler: onCreateSample
	});

	async function onCreateSample(req, reply) {
		try {
			const storage = await server.storagesService.getStorageById(req.body.storageId);

			if (!storage) {
				return reply.code(400).send({ status: 'error', message: `No such storage location` });
			}

			const { reagentsAndSamples } = req.body;

			const insufficientComponent =
				await server.samplesService.areComponentsInsufficient(reagentsAndSamples);

			if (insufficientComponent) {
				return reply
					.code(400)
					.send({ status: 'error', message: `Not enough ${insufficientComponent} left` });
			}

			const sampleName = await server.samplesService.createSample(req.body);

			const getSubstanceById = async item => {
				return item.category === Category.REAGENT
					? server.reagentsService.getReagentById(item.id)
					: server.samplesService.getSampleById(item.id);
			};

			await Promise.all(
				reagentsAndSamples.map(async item => {
					const substance = await getSubstanceById(item);

					await server.substancesService.changeSubstanceQuantity(item.id, {
						category: item.category,
						quantityUsed: item.quantityUsed,
						quantityLeft: substance.quantityLeft - item.quantityUsed,
						userId: req.session.user.id,
						reason: `Used in making ${sampleName}`
					});
				})
			);

			return reply
				.code(201)
				.send({ status: 'success', message: `Sample '${sampleName}' was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'samples/:id',
		preValidation: [server.authenticate],
		schema: schema.getSample,
		handler: onGetSample
	});

	async function onGetSample(req, reply) {
		try {
			const id = req.params.id;

			const sample = await server.samplesService.getSampleById(id);

			if (!sample) {
				return reply.code(404).send({
					status: 'error',
					message: `Sample not found`
				});
			}

			return reply.code(200).send(sample);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'samples/:id',
		preValidation: [server.authenticate],
		schema: schema.deleteSample,
		handler: onDeleteSample
	});

	async function onDeleteSample(req, reply) {
		try {
			const id = req.params.id;

			const sample = await server.samplesService.getSampleById(id);

			if (!sample) {
				return reply.code(404).send({ status: 'error', message: `No such sample` });
			}

			const sampleName = await server.samplesService.softDeleteSample(id);

			return reply
				.code(200)
				.send({ status: 'success', message: `Sample '${sampleName}' was deleted` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(samples);
