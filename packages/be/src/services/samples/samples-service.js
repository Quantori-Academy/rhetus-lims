import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { and, eq, sql } from 'drizzle-orm';

async function samplesService(server) {
	server.decorate('samplesService', {
		createSample: async data => {
			const {
				name,
				quantityUnit,
				expirationDate,
				quantityLeft,
				size,
				description,
				reagentsAndSamples,
				storageLocationId
			} = data;

			const sample = await server.db
				.insert(schema.samples)
				.values({
					name: name,
					quantityUnit,
					quantityLeft,
					size,
					expirationDate: new Date(expirationDate),
					storageLocationId,
					description
				})
				.returning({ id: schema.samples.id, name: schema.samples.name });

			const sampleReagentRelationships = reagentsAndSamples
				.filter(x => x.category === 'reagent')
				.map(x => ({ parentSampleId: sample[0].id, childReagentId: x.id }));

			if (sampleReagentRelationships.length > 0)
				await server.db.insert(schema.sampleReagentUsage).values(sampleReagentRelationships);

			const sampleSampleRelationships = reagentsAndSamples
				.filter(x => x.category === 'sample')
				.map(x => ({ parentSampleId: sample[0].id, childSampleId: x.id }));

			if (sampleSampleRelationships.length > 0)
				await server.db.insert(schema.sampleSampleUsage).values(sampleSampleRelationships);

			return sample.length ? sample[0].name : null;
		},

		getSampleById: async id => {
			const sample = await server.db
				.select({
					id: schema.samples.id,
					name: schema.samples.name,
					quantityUnit: schema.samples.quantityUnit,
					quantityLeft: schema.samples.quantityLeft,
					size: schema.samples.size,
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

			const reagents = await server.db
				.select({
					id: schema.sampleReagentUsage.childReagentId,
					name: schema.reagents.name,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					description: schema.reagents.description,
					// storageLocation: {
					// 	id: schema.locations.id,
					// 	name: schema.locations.name
					// }
					category: sql`'reagent'`.as('category')
				})
				.from(schema.sampleReagentUsage)
				.innerJoin(
					schema.reagents,
					eq(schema.reagents.id, schema.sampleReagentUsage.childReagentId)
				)
				.where(eq(id, schema.sampleReagentUsage.parentSampleId));

			const samples = await server.db
				.select({
					id: schema.sampleSampleUsage.childSampleId,
					name: schema.samples.name,
					quantityUnit: schema.samples.quantityUnit,
					quantityLeft: schema.samples.quantityLeft,
					quantity: schema.samples.size,
					expirationDate: schema.samples.expirationDate,
					description: schema.samples.description,
					// storageLocation: {
					// 	id: schema.locations.id,
					// 	name: schema.locations.name
					// }
					category: sql`'sample'`.as('category')
				})
				.from(schema.sampleSampleUsage)
				.innerJoin(schema.samples, eq(schema.samples.id, schema.sampleSampleUsage.childSampleId))
				.where(eq(id, schema.sampleSampleUsage.parentSampleId));

			const result = {
				...sample[0],
				reagentsAndSamples: [...reagents, ...samples]
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
