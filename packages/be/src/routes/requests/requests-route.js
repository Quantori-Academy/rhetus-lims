import fp from 'fastify-plugin';

import * as schema from './requests-schema.js';
import requestsService from '../../services/requests/requests-service.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';

async function requests(server, options) {
	await server.register(requestsService);

	server.route({
		method: 'POST',
		path: options.prefix + 'requests',
		preValidation: [server.authenticate],
		schema: schema.createRequest,
		handler: onCreateRequest
	});

	async function onCreateRequest(req, reply) {
		try {
			const authenticatedUserId = Number(req.session.user.id);
			const reagentName = await server.requestsService.createRequest({
				...req.body,
				userId: authenticatedUserId
			});

			return reply
				.code(201)
				.send({ status: 'success', message: `Request for reagent '${reagentName}' was created` });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'requests/:id',
		preValidation: [server.authenticate],
		schema: schema.getRequest,
		handler: onGetRequest
	});

	async function onGetRequest(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const requestId = req.params.id;
			const request = await server.requestsService.getRequestById(requestId);

			if (!request) {
				return reply.code(404).send({ status: 'error', message: `No such reagent request` });
			}

			const isOwnerOrOfficer = await server.requestsService.isOwnerOrOfficer(
				requestId,
				authenticatedUserId
			);

			if (!isOwnerOrOfficer) {
				return reply.code(403).send({
					status: 'error',
					message: `Sorry. You have no permissions to view this reagent request`
				});
			}

			return reply.code(200).send(request);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'requests',
		preValidation: [server.authenticate],
		schema: schema.getRequests,
		handler: onGetRequests
	});

	async function onGetRequests(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const data = await server.requestsService.getRequests(req.query, authenticatedUserId);

			return reply.code(200).send(data);
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'PATCH',
		path: options.prefix + 'requests/:id',
		preValidation: [server.authenticate],
		schema: schema.updateRequest,
		handler: onUpdateRequest
	});

	async function onUpdateRequest(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const requestId = req.params.id;
			const request = await server.requestsService.getRequestById(requestId);

			if (!request) {
				return reply.code(404).send({ status: 'error', message: `No such reagent request` });
			}

			const isOwnerOrOfficer = await server.requestsService.isOwnerOrOfficer(
				requestId,
				authenticatedUserId
			);

			if (!isOwnerOrOfficer) {
				return reply.code(403).send({
					status: 'error',
					message: `Sorry. You have no permissions to change this reagent request`
				});
			}

			const { code, status, message } = await server.requestsService.handleRequestUpdate(
				{ requestId, requestStatus: request.status, ownerId: request.author.id },
				req.body,
				authenticatedUserId
			);
			return reply.code(code).send({ status, message });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'requests/:id',
		preValidation: [server.authenticate],
		schema: schema.deleteRequest,
		handler: onDeleteRequest
	});

	async function onDeleteRequest(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const requestId = req.params.id;
			const request = await server.requestsService.getRequestById(requestId);

			if (!request) {
				return reply.code(404).send({ status: 'error', message: `No such reagent request` });
			}

			const isOwnerOrOfficer = await server.requestsService.isOwnerOrOfficer(
				requestId,
				authenticatedUserId
			);

			if (!isOwnerOrOfficer) {
				return reply.code(403).send({
					status: 'error',
					message: `Sorry. You have no permissions to delete this reagent request`
				});
			}

			const { code, status, message } = await server.requestsService.handleRequestSoftDelete({
				requestId,
				requestStatus: request.status
			});

			return reply.code(code).send({ status, message });
		} catch (err) {
			return reply.code(500).send(err);
		}
	}

	server.route({
		method: 'PUT',
		path: options.prefix + 'requests/:id/cancel',
		preValidation: [server.authenticate, server.officer],
		schema: schema.cancelRequest,
		handler: onCancelRequest
	});

	async function onCancelRequest(req, reply) {
		try {
			const authenticatedUserId = req.session.user.id;
			const requestId = req.params.id;
			const request = await server.requestsService.getRequestById(requestId);

			if (!request) {
				return reply.code(404).send({ status: 'error', message: `No such reagent request` });
			}

			if (request.status !== RequestStatus.PENDING) {
				return reply.code(403).send({
					status: 'error',
					message: `Sorry. You cannot mark reagent request as canceled while it is not in 'pending' status`
				});
			}

			const isOfficer = await server.usersService.isOfficer(authenticatedUserId);

			if (!isOfficer) {
				return reply.code(403).send({
					status: 'error',
					message: `Sorry. You have no permissions to mark this reagent request as canceled`
				});
			}

			const reagentName = await server.requestsService.cancelRequest(requestId, {
				...req.body,
				currentPoComment: request.poComment
			});

			return reply.code(200).send({
				status: 'success',
				message: `Request for reagent '${reagentName}' was marked as canceled`
			});
		} catch (err) {
			return reply.code(500).send(err);
		}
	}
}

export default fp(requests);
