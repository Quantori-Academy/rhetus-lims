import { unionAll } from 'drizzle-orm/pg-core';
import fp from 'fastify-plugin';
import { Category } from '../../routes/substances/substances-schema.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';

async function substancesService(server) {
	server.decorate('substancesService', {
		getSubstances: async queryParams => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			const reagentsQuery = server.reagentsService.getReagentsQuery();
			const samplesQuery = server.samplesService.getSamplesQuery();

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

		validateSubstanceUpdateInput: async (id, data, userId) => {
			const { category, storageId, quantityUsed, quantityLeft, reason } = data;
			const updatedData = { category, userId };

			if (storageId) {
				const storage = await server.storagesService.getStorageById(storageId);
				if (!storage) {
					return {
						isValid: false,
						codeStatus: 404,
						errorMessage: 'No such storage',
						updatedData: null
					};
				}
				updatedData.storageId = storageId;
			}

			if (quantityUsed && reason) {
				const canQuantityChange = await server.substancesService.canQuantityChange(id, {
					quantityUsed,
					quantityLeft,
					reason,
					category
				});
				if (!canQuantityChange) {
					return {
						isValid: false,
						codeStatus: 409,
						errorMessage: `Quantity of ${category} cannot be changed. Check sending values`,
						updatedData: null
					};
				}
				updatedData.quantityUsed = quantityUsed;
				updatedData.reason = reason;
				updatedData.quantityLeft = quantityLeft;
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
