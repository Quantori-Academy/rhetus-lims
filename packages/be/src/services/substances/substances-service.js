import { unionAll } from 'drizzle-orm/pg-core';
import fp from 'fastify-plugin';
import { Category } from '../../routes/substances/substances-schema.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { sql } from 'drizzle-orm';

async function substancesService(server) {
	server.decorate('substancesService', {
		getSubstances: async queryParams => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			const reagentsQuery = server.reagentsService.getReagentsQuery({ structure: 'schema' });
			const samplesQuery = server.samplesService.getSamplesQuery({ structure: sql`${null}` });

			const unionQuery = unionAll(reagentsQuery, samplesQuery);
			let query = server.db.select().from(unionQuery.as('substances'));

			query = applyFilters(query, options, 'substances');
			query = applySorting(query, sort, 'substances');

			const count = await query;
			const substances = await query.limit(limit).offset(offset);

			return {
				substances,
				count: count.length
			};
		},

		getSubstanceById: async (id, category) => {
			return category === Category.REAGENT
				? await server.reagentsService.getReagentById(id)
				: await server.samplesService.getSampleById(id);
		},

		changeSubstanceQuantity: async (id, data) => {
			const { code, status, message } =
				data.category === Category.REAGENT
					? await server.reagentsService.changeReagentQuantity(id, data)
					: await server.samplesService.changeSampleQuantity(id, data);

			return { code, status, message };
		},

		canQuantityChange: async (id, data) => {
			const { quantityUsed, quantityLeft: reqQuantityLeft, category } = data;

			const { quantityLeft } = await server.substancesService.getSubstanceById(id, category);

			const diff = quantityLeft - quantityUsed;

			return diff >= 0 && diff === reqQuantityLeft;
		},

		validateStorageUpdateInput: async data => {
			const { storageId } = data;
			const storage = await server.storagesService.getStorageById(storageId);
			if (!storage) {
				const error = new Error(`No such storage with id: ${storageId}`);
				error.codeStatus = 404;
				throw error;
			}
			return { storageId };
		},

		validateQuantityUpdateInput: async (id, data) => {
			const { category, quantityUsed, quantityLeft, reason } = data;

			const canQuantityChange = await server.substancesService.canQuantityChange(id, {
				quantityUsed,
				quantityLeft,
				reason,
				category
			});
			if (!canQuantityChange) {
				const error = new Error(`Quantity of ${category} cannot be changed. Check sending values`);
				error.codeStatus = 409;
				throw error;
			}
			return {
				quantityUsed,
				quantityLeft,
				reason
			};
		},

		validateSubstanceUpdateInput: async (id, data, userId) => {
			const { category, storageId, quantityUsed, quantityLeft, reason } = data;
			const updatedData = { category, userId };

			try {
				if (storageId) {
					Object.assign(
						updatedData,
						await server.substancesService.validateStorageUpdateInput(data)
					);
				}
				if (quantityUsed && reason && quantityLeft) {
					Object.assign(
						updatedData,
						await server.substancesService.validateQuantityUpdateInput(id, data)
					);
				}
			} catch (err) {
				return {
					isValid: false,
					codeStatus: err.codeStatus,
					errorMessage: err.message,
					updatedData: null
				};
			}
			return { isValid: true, codeStatus: 200, errorMessage: null, updatedData };
		},

		updateSubstance: async (id, data) => {
			const { category, storageId, quantityUsed, userId, reason } = data;

			const service =
				category === Category.REAGENT ? server.reagentsService : server.samplesService;

			let updateMessages = [];

			if (storageId) {
				const storageUpdateResult = await service.changeStorage(id, { storageId, userId });
				updateMessages.push(storageUpdateResult.message);
			}

			if (quantityUsed && reason) {
				const quantityUpdateResult = await service.changeQuantity(id, {
					quantityUsed,
					reason,
					userId
				});
				updateMessages.push(quantityUpdateResult.message);
			}

			return {
				code: 200,
				status: 'success',
				message: `${updateMessages.join('; ')}`
			};
		}
	});
}

export default fp(substancesService);
