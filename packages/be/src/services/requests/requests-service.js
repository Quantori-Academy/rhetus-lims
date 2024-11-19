import { eq, and, aliasedTable } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { RequestStatus } from '../../lib/db/schema/requests.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { helpers } from '../../lib/utils/common/helpers.js';

const formatMapping = {
	reagentName: string => helpers.capitalize(string),
	casNumber: string => helpers.lowercase(string),
	quantityUnit: string => helpers.lowercase(string)
};

async function requestsService(server) {
	server.decorate('requestsService', {
		createRequest: async data => {
			const {
				reagentName,
				structure,
				casNumber,
				quantity,
				userComment,
				userId,
				quantityUnit,
				amount
			} = data;

			const result = await server.db
				.insert(schema.requests)
				.values({
					reagentName: formatMapping.reagentName(reagentName),
					structure,
					casNumber: formatMapping.casNumber(casNumber),
					quantity,
					userComment,
					userId,
					quantityUnit: formatMapping.quantityUnit(quantityUnit),
					amount
				})
				.returning({ reagentName: schema.requests.reagentName });

			return result.length ? result[0].reagentName : null;
		},

		getRequestsQuery: () => {
			const orderAuthor = aliasedTable(schema.users, 'orderAuthor');

			return server.db
				.select({
					id: schema.requests.id,
					author: {
						id: schema.users.id,
						username: schema.users.username
					},
					reagentName: schema.requests.reagentName,
					quantity: schema.requests.quantity,
					status: schema.requests.requestStatus,
					userComment: schema.requests.userComment,
					poComment: schema.requests.poComment,
					createdAt: schema.requests.createdAt,
					updatedAt: schema.requests.updatedAt,
					structure: schema.requests.structure,
					casNumber: schema.requests.casNumber,
					quantityUnit: schema.requests.quantityUnit,
					amount: schema.requests.amount,
					order: {
						id: schema.orders.id,
						title: schema.orders.title,
						seller: schema.orders.seller,
						createdAt: schema.orders.createdAt,
						updatedAt: schema.orders.updatedAt,
						status: schema.orders.orderStatus,
						author: {
							id: orderAuthor.id,
							username: orderAuthor.username
						}
					}
				})
				.from(schema.requests)
				.leftJoin(schema.orders, eq(schema.requests.orderId, schema.orders.id))
				.leftJoin(schema.users, eq(schema.requests.userId, schema.users.id))
				.leftJoin(orderAuthor, eq(schema.orders.userId, orderAuthor.id));
		},

		getRequestById: async id => {
			const query = server.requestsService.getRequestsQuery();

			const result = await query.where(
				and(eq(schema.requests.id, id), eq(schema.requests.deleted, false))
			);

			return result[0];
		},

		getRequests: async (queryParams, userId) => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			let query = server.requestsService.getRequestsQuery();

			const isOfficer = await server.usersService.isOfficer(userId);

			query = isOfficer
				? applyFilters(query, { ...options, deleted: 'false' }, 'requests')
				: applyFilters(query, { ...options, deleted: 'false', userId }, 'requests');

			query = applySorting(query, sort, 'requests');

			const count = await query;
			const requests = await query.limit(limit).offset(offset);

			return {
				requests,
				count: count.length
			};
		},

		updateRequest: async (id, data) => {
			const dataForUpdate = Object.fromEntries(
				Object.entries(data).map(([key, value]) =>
					!Object.keys(formatMapping).includes(key)
						? [key, value]
						: [key, formatMapping[key](value)]
				)
			);

			const result = await server.db
				.update(schema.requests)
				.set(dataForUpdate)
				.where(eq(schema.requests.id, id))
				.returning({ reagentName: schema.requests.reagentName });

			return result.length ? result[0].reagentName : null;
		},

		isOwnerOrOfficer: async (requestId, userId) => {
			const {
				author: { id: ownerId }
			} = await server.requestsService.getRequestById(requestId);

			const isOwner = ownerId === userId;

			const isOfficer = await server.usersService.isOfficer(userId);

			return isOfficer || isOwner;
		},

		handleRequestUpdate: async (requestData, updateData, userId) => {
			const { requestId, requestStatus, ownerId } = requestData;
			const isOfficer = await server.usersService.isOfficer(userId);
			const isOwner = ownerId === userId;

			if (isOfficer) {
				if ('userComment' in updateData && !isOwner) {
					return {
						code: 403,
						status: 'error',
						message: 'Sorry. You cannot change user comment'
					};
				}

				const reagentName = await server.requestsService.updateRequest(requestId, updateData);

				return {
					code: 200,
					status: 'success',
					message: `Request for reagent '${reagentName}' was updated`
				};
			}

			if ('poComment' in updateData) {
				return {
					code: 403,
					status: 'error',
					message: 'Sorry. You have no permissions to change procurement officer comment'
				};
			}

			if (requestStatus !== RequestStatus.PENDING) {
				return {
					code: 403,
					status: 'error',
					message: 'Sorry. You have no permissions to update reagent request while processing'
				};
			}

			const reagentName = await server.requestsService.updateRequest(requestId, updateData);

			return {
				code: 200,
				status: 'success',
				message: `Request for reagent '${reagentName}' was updated`
			};
		},

		handleRequestSoftDelete: async requestData => {
			const { requestId, requestStatus } = requestData;

			if (requestStatus !== RequestStatus.PENDING) {
				return {
					code: 403,
					status: 'error',
					message: 'Sorry. Cannot delete reagent request while processing'
				};
			}

			const reagentName = await server.requestsService.updateRequest(requestId, {
				deleted: 'true'
			});

			return {
				code: 200,
				status: 'success',
				message: `Request for reagent '${reagentName}' was deleted`
			};
		},

		updateRequestStatusByOrder: async (orderId, newStatus, tx) => {
			return tx
				.update(schema.requests)
				.set({ requestStatus: newStatus })
				.where(eq(schema.requests.orderId, orderId));
		},

		cancelRequest: async (requestId, data) => {
			const { reason, currentPoComment } = data ?? {};

			const cancelationTemplate = `Cancelation reason: ${reason}`;
			const newPoComment = currentPoComment
				? `${currentPoComment}; ${cancelationTemplate}`
				: `${cancelationTemplate}`;

			const result = await server.db
				.update(schema.requests)
				.set({
					requestStatus: RequestStatus.CANCELED,
					poComment: newPoComment
				})
				.where(eq(schema.requests.id, requestId))
				.returning({ reagentName: schema.requests.reagentName });

			return result.length ? result[0].reagentName : null;
		}
	});
}

export default fp(requestsService);
