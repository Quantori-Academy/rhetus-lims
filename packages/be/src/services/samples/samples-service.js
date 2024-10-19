import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { and, eq, sql } from 'drizzle-orm';
import { Category } from '../../routes/substances/substances-schema.js';

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
				id: sample[0].id,
				quantityUsed: x.quantityUsed,
				...(x.category === Category.REAGENT ? { reagentId: x.id } : { sampleId: x.id })
			}));

			await server.db.insert(schema.components).values(components);

			return sample.length ? sample[0].name : null;
		},

		areComponentsInsufficient: async components => {
			for (const component of components) {
				const substance = await server.substancesService.getSubstanceById(
					component.id,
					component.category
				);

				if (!substance) {
					return true;
				}

				const diff = substance.quantityLeft - component.quantityUsed;

				if (diff < 0) {
					return true;
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
					description: schema.samples.description,
					storageLocation: {
						id: schema.storages.id,
						name: schema.storages.name,
						room: schema.storages.room,
						description: schema.storages.description
					}
				})
				.from(schema.samples)
				.innerJoin(schema.storages, eq(schema.storages.id, schema.samples.storageId))
				.where(and(eq(id, schema.samples.id), eq(schema.samples.deleted, false)))
				.limit(1);

			if (!sample[0]) return null;

			const reagentsAndSamples = await server.db
				.select({
					id: schema.components.reagentId,
					name: schema.reagents.name,
					quantityUsed: schema.components.quantityUsed,
					quantityUnit: schema.reagents.quantityUnit,
					quantity: schema.reagents.quantity,
					quantityLeft: schema.reagents.quantityLeft,
					expirationDate: schema.reagents.expirationDate,
					description: schema.reagents.description,
					category: sql`'reagent'`.as('category')
				})
				.from(schema.components)
				.innerJoin(schema.reagents, eq(schema.reagents.id, schema.components.reagentId))
				.where(eq(id, schema.components.id))
				.union(
					server.db
						.select({
							id: schema.components.sampleId,
							name: schema.samples.name,
							quantityUsed: schema.components.quantityUsed,
							quantityUnit: schema.samples.quantityUnit,
							quantity: schema.samples.quantity,
							quantityLeft: schema.samples.quantityLeft,
							expirationDate: schema.samples.expirationDate,
							description: schema.samples.description,
							category: sql`'sample'`.as('category')
						})
						.from(schema.components)
						.innerJoin(schema.samples, eq(schema.samples.id, schema.components.sampleId))
						.where(eq(id, schema.components.id))
				);

			return {
				...sample[0],
				reagentsAndSamples
			};
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
