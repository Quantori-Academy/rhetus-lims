import { eq, and, aliasedTable, sql } from 'drizzle-orm';
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

const CommentsType = {
	USER: 'userComment',
	OFFICER: 'poComment'
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
				.returning({ reagentName: schema.requests.reagentName, id: schema.requests.id });

			if (!result.length) return null;

			await server.notificationsService.addNotification({
				requestId: result[0].id,
				message: `New request for '${result[0].reagentName}' created.`
			});

			await server.requestsService.insertStatusInHistory(
				result[0].id,
				{ status: RequestStatus.PENDING },
				userId
			);

			return result[0].reagentName;
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
			const result = await server.db
				.update(schema.requests)
				.set(data)
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

		handleRequestUpdate: async (requestData, data, userId) => {
			const { requestId, existingRequest } = requestData;

			const isOfficer = await server.usersService.isOfficer(userId);
			const isOwner = existingRequest.author.id === userId;

			if (existingRequest.status !== RequestStatus.PENDING) {
				return {
					code: 409,
					status: 'error',
					message: 'Sorry. You cannot update reagent request while processing'
				};
			}

			const updateData = Object.fromEntries(
				Object.entries(data)
					.map(([key, value]) => {
						const formattedIncomingValue = Object.keys(formatMapping).includes(key)
							? formatMapping[key](value)
							: value;

						if (existingRequest[key] === formattedIncomingValue) {
							return;
						}

						return [key, formattedIncomingValue];
					})
					.filter(Boolean)
					.filter(item => server.requestsService.filterByOwner(item, { isOfficer, isOwner }))
			);

			if (!Object.keys(updateData).length) {
				return {
					code: 205,
					status: 'info',
					message: 'There is nothing to update. Check sending values or request state'
				};
			}

			const updatedRequestReagentName = await server.requestsService.updateRequest(
				requestId,
				updateData
			);

			if (!isOwner)
				await server.notificationsService.addNotification({
					requestId,
					message: `Request for reagent '${updatedRequestReagentName}' has updates`
				});

			return {
				code: 200,
				status: 'success',
				message: `Request for reagent '${updatedRequestReagentName}' was updated to reflect the new information and your permissions`
			};
		},

		filterByOwner: (data, permissions) => {
			const [key] = data;
			const { isOfficer, isOwner } = permissions;

			if (!Object.values(CommentsType).includes(key)) {
				return true;
			}

			if (key === CommentsType.OFFICER && !isOfficer) {
				return false;
			}

			if (key === CommentsType.USER && !isOwner) {
				return false;
			}

			return true;
		},

		handleRequestSoftDelete: async requestData => {
			const { requestId, requestStatus, userId } = requestData;

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

			await server.db.insert(schema.statusesHistory).values({
				userId,
				requestId,
				status: requestStatus,
				isDeleted: true
			});

			return {
				code: 200,
				status: 'success',
				message: `Request for reagent '${reagentName}' was deleted`
			};
		},

		updateRequestStatusByOrder: async (orderId, newStatus, tx, userId) => {
			const result = await tx
				.update(schema.requests)
				.set({ requestStatus: newStatus })
				.where(eq(schema.requests.orderId, orderId))
				.returning({ requestId: schema.requests.id });

			if (!result.length) return null;

			await server.requestsService.insertStatusInHistory(
				result[0].requestId,
				{ status: newStatus },
				userId,
				tx
			);
			return result[0].requestId;
		},

		cancelRequest: async (requestId, data) => {
			const { reason, currentPoComment, userId } = data ?? {};

			const cancellationTemplate = `Cancellation reason: ${reason}`;
			const newPoComment = currentPoComment
				? `${currentPoComment}; ${cancellationTemplate}`
				: `${cancellationTemplate}`;

			const result = await server.db
				.update(schema.requests)
				.set({
					requestStatus: RequestStatus.CANCELED,
					poComment: newPoComment
				})
				.where(eq(schema.requests.id, requestId))
				.returning({ reagentName: schema.requests.reagentName });

			await server.notificationsService.addNotification({
				requestId,
				message: `Request for '${result[0].reagentName}' cancelled for the following reason: '${reason}'.`
			});

			await server.requestsService.insertStatusInHistory(
				requestId,
				{ status: RequestStatus.CANCELED, poComment: newPoComment },
				userId
			);
			return result.length ? result[0].reagentName : null;
		},

		insertStatusInHistory: async (requestId, data, userId, tx = null) => {
			const target = tx ?? server.db;
			return await target.insert(schema.statusesHistory).values({
				userId,
				requestId,
				status: data.status,
				changeReason: data?.poComment
			});
		},

		getHistoryChanges: async requestId => {
			const histories = await server.db
				.select({
					id: sql`${schema.statusesHistory.id}`.as('historyId'),
					user: {
						userId: schema.users.id,
						userFirstName: schema.users.firstName,
						userLastName: schema.users.lastName
					},
					status: schema.statusesHistory.status,
					changeReason: schema.statusesHistory.changeReason,
					isDeleted: schema.statusesHistory.isDeleted,
					modifiedDate: schema.statusesHistory.createdAt
				})
				.from(schema.statusesHistory)
				.innerJoin(schema.users, eq(schema.statusesHistory.userId, schema.users.id))
				.where(eq(schema.statusesHistory.requestId, requestId))
				.orderBy(schema.statusesHistory.createdAt, 'asc');

			return { histories };
		}
	});
}

export default fp(requestsService);
