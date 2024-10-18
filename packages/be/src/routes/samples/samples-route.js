import fp from 'fastify-plugin';
import * as schema from './samples-schema.js';
import samplesService from '../../services/samples/samples-service.js';

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
			// TODO
			// const { room, cabinet, shelf } = req.body;
			// const location = await server.locationsService.findLocationByName({
			// 	room,
			// 	name: cabinet + ', ' + shelf
			// });
			// if (!location) {
			// 	return reply
			// 		.code(400)
			// 		.send({
			// 			status: 'error',
			// 			message: `No storage location ${room} ${cabinet} ${shelf} found`
			// 		});
			// }

			const { reagentsAndSamples, name } = req.body;

			const areComponentsValid = await validateReagentsAndSamples(reagentsAndSamples);
			if (!areComponentsValid) {
				return reply.code(400).send({
					status: 'error',
					message: `Reagent or sample used in making ${name} not found`
				});
			}

			// TODO: add location id
			const sampleName = await server.samplesService.createSample({
				...req.body
			});

			return reply
				.code(201)
				.send({ status: 'success', message: `Sample '${sampleName}' was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	async function validateReagentsAndSamples(array) {
		for (let i = 0; i < array.length; i++) {
			const substance =
				array[i].category === 'reagent'
					? await server.reagentsService.getReagentById(array[i].id)
					: await server.samplesService.getSampleById(array[i].id);

			if (!substance) {
				return false;
			}
		}
		return true;
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

	server.route({
		method: 'PATCH',
		path: options.prefix + 'samples/:id',
		preValidation: [server.authenticate],
		schema: schema.updateSample,
		handler: onUpdateSample
	});

	async function onUpdateSample(req, reply) {
		try {
			const id = req.params.id;

			const sample = await server.samplesService.getSampleById(id);

			if (!sample) {
				return reply.code(404).send({ status: 'error', message: `No such sample` });
			}

			const {
				quantityLeft
				// storageLocation: { room, cabinet, shelf }
			} = req.body;

			if (quantityLeft <= 0) {
				const sampleName = await server.samplesService.softDeleteSample(id);

				return reply
					.code(200)
					.send({ status: 'success', message: `${sampleName} was removed since it ran out` });
			}

			// TODO
			// const location = await server.locationsService.findLocationByName({
			// 	room,
			// 	name: cabinet + ', ' + shelf
			// });
			// if (!location) {
			// 	return reply.code(400).send({
			// 		status: 'error',
			// 		message: `No storage location ${room} ${cabinet} ${shelf} found`
			// 	});
			// }

			const sampleName = await server.samplesService.updateSample(id, {
				quantityLeft
				// storageLocationId: location.id
			});

			return reply.code(200).send({ status: 'success', message: `${sampleName} was updated` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(samples);
