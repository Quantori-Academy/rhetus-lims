import { unionAll } from 'drizzle-orm/pg-core';
import fp from 'fastify-plugin';
import { Category } from '../../routes/substances/substances-schema.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { getRelevanceScore } from '../../lib/db/structure/utils/get-relevance-score.js';
import { sql } from 'drizzle-orm';

async function substancesService(server) {
	server.decorate('substancesService', {
		getSubstances: async queryParams => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			const reagentsQuery = server.reagentsService.getReagentsQuery({
				structure: 'schema',
				relevance: getRelevanceScore('structure', options?.smiles || '').as('relevance')
			});
			const samplesQuery = server.samplesService.getSamplesQuery({
				structure: sql`${null}`,
				relevance: sql`${0}`.as('relevance')
			});

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
					? await server.reagentsService.changeQuantity(id, data)
					: await server.samplesService.changeQuantity(id, data);

			return { code, status, message };
		},

		canQuantityChange: async (id, data) => {
			const { quantityUsed, quantityLeft: reqQuantityLeft, category } = data;

			const { quantityLeft } = await server.substancesService.getSubstanceById(id, category);

			const diff = quantityLeft - quantityUsed;

			return diff >= 0 && diff === reqQuantityLeft;
		},

		checkQuantityZero: async data => {
			const { id, quantityUsed, quantityLeft: reqQuantityLeft, category } = data;
			const { quantityLeft } = await server.substancesService.getSubstanceById(id, category);
			const diff = quantityLeft - quantityUsed;
			return diff === 0 && diff === reqQuantityLeft;
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

		validateNameDescriptionUpdateInput: data => {
			const { name, description } = data;
			const updatedData = {};
			if (name) {
				Object.assign(updatedData, { name });
			}
			if (description) {
				Object.assign(updatedData, { description });
			}
			return updatedData;
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
				if (quantityUsed && reason && quantityLeft >= 0) {
					Object.assign(
						updatedData,
						await server.substancesService.validateQuantityUpdateInput(id, data)
					);
				}

				const updateNameDescription =
					await server.substancesService.validateNameDescriptionUpdateInput(data, updatedData);

				Object.assign(updatedData, updateNameDescription);
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

		updateStorage: async (data, updateMessages, service) => {
			if (data.storageId) {
				const storageUpdateResult = await service.changeStorage(data.id, {
					storageId: data.storageId,
					userId: data.userId
				});
				updateMessages.push(storageUpdateResult.message);
			}
			return updateMessages;
		},

		updateQuantity: async (data, updateMessages, service) => {
			if (data.quantityUsed && data.reason) {
				const isQuantityZero = await server.substancesService.checkQuantityZero(data);
				if (isQuantityZero) {
					await service.softDeleteReagent(data.id);
				} else {
					const quantityUpdateResult = await service.changeQuantity(data.id, {
						quantityUsed: data.quantityUsed,
						reason: data.reason,
						userId: data.userId
					});
					updateMessages.push(quantityUpdateResult.message);
				}
			}
			return updateMessages;
		},

		updateNameDescription: async (data, updateMessages, service) => {
			if (data.name) {
				const nameUpdateResult = await service.changeName(data.id, { name: data.name });
				updateMessages.push(nameUpdateResult.message);
			}

			if (data.description) {
				const descriptionUpdateResult = await service.changeDescription(data.id, {
					description: data.description
				});
				updateMessages.push(descriptionUpdateResult.message);
			}
			return updateMessages;
		},

		updateSubstance: async (id, data) => {
			const { category, storageId, quantityUsed, userId, reason, name, description } = data;
			const service =
				category === Category.REAGENT ? server.reagentsService : server.samplesService;

			let updateMessages = [];

			updateMessages = await server.substancesService.updateStorage(
				{ id, storageId, userId },
				updateMessages,
				service
			);
			updateMessages = await server.substancesService.updateQuantity(
				{ id, quantityUsed, reason, userId, category },
				updateMessages,
				service
			);
			updateMessages = await server.substancesService.updateNameDescription(
				{ id, name, description },
				updateMessages,
				service
			);

			return {
				code: 200,
				status: 'success',
				message: `${updateMessages.join('; ')}`
			};
		}
	});
}

export default fp(substancesService);
