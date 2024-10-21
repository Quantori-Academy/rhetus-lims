import fp from 'fastify-plugin';

import * as schema from './storages-schema.js';
import storagesService from '../../services/storages/storages-service.js';

async function storages(server, options) {
	await server.register(storagesService);

	server.route({
		method: 'POST',
		path: options.prefix + 'storages',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.createStorage,
		handler: onCreateStorage
	});
	async function onCreateStorage(req, reply) {
		try {
			const name = await server.storagesService.createStorage(req.body);
			return reply.code(201).send({ status: 'success', message: `Storage ${name} was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'storages',
		preValidation: [server.authenticate],
		schema: schema.getStorages,
		handler: onGetStorages
	});

	async function onGetStorages(req, reply) {
		try {
			const data = await server.storagesService.getStorages(req.query);
			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'storages/:id',
		preValidation: [server.authenticate],
		schema: schema.getStorage,
		handler: onGetStorage
	});

	async function onGetStorage(req, reply) {
		try {
			const storageId = req.params.id;
			const storage = await server.storagesService.getStorageById(storageId);
			if (!storage) {
				return reply.code(404).send({ status: 'error', message: `No such storage location found` });
			}
			return reply.code(200).send(storage);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'storages/:id',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.updateStorage,
		handler: onUpdateStorage
	});

	async function onUpdateStorage(req, reply) {
		try {
			const storageId = req.params.id;
			const storage = await server.storagesService.getStorageById(storageId);
			if (!storage) {
				return reply.code(404).send({ status: 'error', message: `No such storage location found` });
			}
			const name = await server.storagesService.updateStorage(storageId, req.body);
			return reply.code(200).send({ status: 'success', message: `Storage '${name}' was updated` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'storages/:id',
		preValidation: [server.authenticate, server.administrator],
		schema: schema.deleteStorage,
		handler: onDeleteStorage
	});

	async function onDeleteStorage(req, reply) {
		try {
			const storageId = req.params.id;
			const storage = await server.storagesService.getStorageById(storageId);
			if (!storage) {
				return reply.code(404).send({ status: 'error', message: `No such storage location found` });
			}

			const isStorageEmpty = await server.storagesService.isStorageEmpty(storageId);

			if (!isStorageEmpty) {
				return reply
					.code(409)
					.send({ status: 'error', message: `Can't delete, this storage is not empty` });
			}

			const storageName = await server.storagesService.softDeleteStorage(storageId);
			return reply
				.code(200)
				.send({ status: 'success', message: `Storage '${storageName}' was deleted` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(storages);
