import { unionAll } from 'drizzle-orm/pg-core';
import fp from 'fastify-plugin';
import { Category } from '../../routes/substances/substances-schema.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { applySorting } from '../../lib/utils/db/apply-sorting.js';
import { getRelevanceScore } from '../../lib/db/structure/utils/get-relevance-score.js';
import { isValidSmilesQuery } from '../../lib/db/structure/utils/is-valid-smiles.js';

async function substancesService(server) {
	server.decorate('substancesService', {
		getSubstances: async queryParams => {
			const { options, sort, limit, offset } = getClarifyParams(queryParams);

			const reagentsQuery = server.reagentsService.getReagentsQuery({
				relevance: getRelevanceScore('structure', options?.smiles || '').as('relevance')
			});
			const samplesQuery = server.samplesService.getSamplesQuery({
				relevance: getRelevanceScore('structure', options?.smiles || '').as('relevance')
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
			return data.category === Category.REAGENT
				? server.reagentsService.changeQuantity(id, data)
				: server.samplesService.changeQuantity(id, data);
		},

		canQuantityChange: async (id, data) => {
			const { quantityUsed, quantityLeft: reqQuantityLeft, category } = data;

			const { quantityLeft } = await server.substancesService.getSubstanceById(id, category);

			const diff = quantityLeft - quantityUsed;

			return diff >= 0 && diff === reqQuantityLeft;
		},

		isQuantityZero: async data => {
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
				error.statusCode = 404;
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
				error.statusCode = 409;
				throw error;
			}
			return {
				quantityUsed,
				quantityLeft,
				reason
			};
		},

		validateNameDescriptionUpdateInput: data => {
			return Object.fromEntries(Object.entries(data).filter(([, value]) => Boolean(value)));
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
		},

		updateQuantity: async (data, updateMessages, service) => {
			if (data.quantityUsed && data.reason) {
				const isQuantityZero = await server.substancesService.isQuantityZero(data);
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
		},

		updateName: async (data, updateMessages, service) => {
			if (data.name) {
				const nameUpdateResult = await service.changeName(data.id, { name: data.name });
				updateMessages.push(nameUpdateResult.message);
			}
		},

		updateDescription: async (data, updateMessages, service) => {
			if (data.description) {
				const descriptionUpdateResult = await service.changeDescription(data.id, {
					description: data.description
				});
				updateMessages.push(descriptionUpdateResult.message);
			}
		},

		updateSubstance: async (id, data) => {
			const { category, storageId, quantityUsed, userId, reason, name, description } = data;
			const isReagent = category === Category.REAGENT;
			const service = isReagent ? server.reagentsService : server.samplesService;

			let updateMessages = [];

			await Promise.all([
				server.substancesService.updateStorage({ id, storageId, userId }, updateMessages, service),
				server.substancesService.updateQuantity(
					{ id, quantityUsed, reason, userId, category },
					updateMessages,
					service
				),
				server.substancesService.updateName({ id, name }, updateMessages, service),
				server.substancesService.updateDescription({ id, description }, updateMessages, service)
			]);
			return {
				code: 200,
				status: 'success',
				message:
					updateMessages.length > 1
						? `${isReagent ? 'Reagent' : 'Sample'} was updated`
						: updateMessages[0]
			};
		},

		softDeleteSubstance: async (id, category) => {
			return category === Category.REAGENT
				? server.reagentsService.softDeleteReagent(id)
				: server.samplesService.softDeleteSample(id);
		},

		isStructureValid: async smiles => {
			const result = await server.db.execute(isValidSmilesQuery(smiles));
			return result.rows[0].is_valid;
		},

		createSubstance: async data => {
			return data.category === Category.REAGENT
				? server.reagentsService.createReagent(data)
				: server.samplesService.createSample(data);
		},

		areComponentsInsufficient: async (components, category) => {
			if (category === Category.REAGENT) {
				return false;
			}

			for (const component of components) {
				const substance = await server.substancesService.getSubstanceById(
					component.id,
					component.category
				);

				if (!substance) return true;

				const diff = substance.quantityLeft - component.quantityUsed;

				if (diff < 0) {
					return true;
				}
			}
			return false;
		}
	});
}

export default fp(substancesService);
