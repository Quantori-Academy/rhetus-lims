import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { and, eq, sql } from 'drizzle-orm';
import { Category, components } from '../../lib/db/schema/components.js';

const formatMapping = {
	name: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`
};

async function samplesService(server) {
	server.decorate('samplesService', {
		createSample: async data => {
			const {
				name,
				quantity,
				quantityLeft,
				quantityUnit,
				expirationDate,
				description,
				reagentsAndSamples,
				storageId
			} = data;

			const sample = await server.db
				.insert(schema.samples)
				.values({
					name: formatMapping.name(name),
					quantity,
					quantityUnit,
					quantityLeft,
					storageId,
					description,
					expirationDate: new Date(expirationDate)
				})
				.returning({ id: schema.samples.id, name: schema.samples.name });

			const components = reagentsAndSamples.map(x => ({
				id: sample.id,
				category: x.category,
				quantityUsed: x.quantityUsed,
				quantityUnit: x.quantityUnit,
				...(x.category === Category.REAGENT ? { reagentId: x.id } : { sampleId: x.id })
			}));

			await server.db.insert(schema.components).values(components);

			return sample.length ? sample[0].name : null;
		},

		areComponentsInsufficient: async components => {
			for (let i = 0; i < components.length; i++) {
				const substance =
					components[i].category === Category.REAGENT
						? await server.reagentsService.getReagentById(components[i].id)
						: await server.samplesService.getSampleById(components[i].id);

				const diff = substance.quantityLeft - components[i].quantityUsed;

				if (diff < 0) {
					return substance.name;
				}
			}
			return false;
		},

		getSampleById: async id => {
			const sample = await server.db
				.select({
					id: schema.samples.id,
					name: schema.samples.name,
					quantityUnit: schema.samples.quantityUnit,
					quantityLeft: schema.samples.quantityLeft,
					quantity: schema.samples.quantity,
					expirationDate: schema.samples.expirationDate,
					description: schema.samples.description
					// storageLocation: {
					// 	id: schema.locations.id,
					// 	name: schema.locations.name
					// }
				})
				.from(schema.samples)
				.where(and(eq(id, schema.samples.id), eq(schema.samples.deleted, false)))
				.limit(1);

			if (!sample[0]) return null;

			// const reagents = await server.db
			// 	.select({
			// 		id: schema.sampleReagentUsage.childReagentId,
			// 		name: schema.reagents.name,
			// 		quantityUnit: schema.reagents.quantityUnit,
			// 		quantity: schema.reagents.quantity,
			// 		quantityLeft: schema.reagents.quantityLeft,
			// 		expirationDate: schema.reagents.expirationDate,
			// 		description: schema.reagents.description,
			// 		// storageLocation: {
			// 		// 	id: schema.locations.id,
			// 		// 	name: schema.locations.name
			// 		// }
			// 		category: sql`'reagent'`.as('category')
			// 	})
			// 	.from(schema.sampleReagentUsage)
			// 	.innerJoin(
			// 		schema.reagents,
			// 		eq(schema.reagents.id, schema.sampleReagentUsage.childReagentId)
			// 	)
			// 	.where(eq(id, schema.sampleReagentUsage.parentSampleId));

			// const samples = await server.db
			// 	.select({
			// 		id: schema.sampleSampleUsage.childSampleId,
			// 		name: schema.samples.name,
			// 		quantityUnit: schema.samples.quantityUnit,
			// 		quantityLeft: schema.samples.quantityLeft,
			// 		quantity: schema.samples.size,
			// 		expirationDate: schema.samples.expirationDate,
			// 		description: schema.samples.description,
			// 		// storageLocation: {
			// 		// 	id: schema.locations.id,
			// 		// 	name: schema.locations.name
			// 		// }
			// 		category: sql`'sample'`.as('category')
			// 	})
			// 	.from(schema.sampleSampleUsage)
			// 	.innerJoin(schema.samples, eq(schema.samples.id, schema.sampleSampleUsage.childSampleId))
			// 	.where(eq(id, schema.sampleSampleUsage.parentSampleId));

			const result = {
				...sample[0]
				// reagentsAndSamples: [...reagents, ...samples]
			};

			return result;
		},

		softDeleteSample: async id => {
			const result = await server.db
				.update(schema.samples)
				.set({
					deleted: true
				})
				.where(eq(schema.samples.id, id))
				.returning({ name: schema.samples.name });

			return result.length ? result[0].name : null;
		},

		updateSample: async (id, data) => {
			const { quantityLeft, storageLocationId } = data;

			const dataForUpdate = {};
			if (quantityLeft) dataForUpdate.quantityLeft = quantityLeft;
			if (storageLocationId) dataForUpdate.storageLocationId = storageLocationId;

			if (Object.keys(dataForUpdate).length === 0) {
				return null;
			}

			const result = await server.db
				.update(schema.samples)
				.set(dataForUpdate)
				.where(eq(schema.samples.id, id))
				.returning({ name: schema.samples.name });

			return result.length ? result[0].name : null;
		},

		changeSampleQuantity: async (id, data) => {
			const { userId, quantityUsed, reason } = data;

			const { quantityLeft, name } = await server.samplesService.getSampleById(id);

			const diff = quantityLeft - quantityUsed;
			const canQuantityChange = diff >= 0;

			if (!canQuantityChange) {
				return {
					code: 409,
					status: 'error',
					message: `Quantity of sample '${name}' cannot be changed. Check sending values`
				};
			}

			await server.db.insert(schema.substancesQuantityChanges).values({
				userId,
				sampleId: id,
				previousValue: quantityLeft,
				targetValue: diff,
				changeReason: reason
			});

			const result = await server.db
				.update(schema.samples)
				.set({
					quantityLeft: diff
				})
				.where(eq(schema.samples.id, id))
				.returning({
					sampleName: schema.samples.name
				});

			if (diff === 0) {
				await server.samplesService.softDeleteSample(id);
			}

			return {
				code: 200,
				status: 'success',
				message: `Quantity of sample '${result[0].sampleName}' was changed`
			};
		},

		getSamplesQuery: () => {
			return server.db
				.select({
					id: schema.samples.id,
					name: schema.samples.name,
					quantityUnit: schema.samples.quantityUnit,
					quantity: schema.samples.size,
					quantityLeft: schema.samples.quantityLeft,
					expirationDate: schema.samples.expirationDate,
					storageLocationId: schema.samples.storageLocationId,
					description: schema.samples.description,
					category: sql`'sample'`.as('category')
				})
				.from(schema.samples)
				.where(eq(schema.samples.deleted, false));
		}
	});
}

export default fp(samplesService);
