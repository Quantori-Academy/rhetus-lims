import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { and, eq, sql } from 'drizzle-orm';
import { Category } from '../../routes/substances/substances-schema.js';
import { helpers } from '../../lib/utils/common/helpers.js';

const formatMapping = {
	name: string => helpers.capitalize(string)
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
				components,
				storageId,
				structure
			} = data;

			const sample = await server.db
				.insert(schema.samples)
				.values({
					name: formatMapping.name(name),
					quantity,
					quantityUnit,
					quantityLeft,
					storageId,
					structure,
					description,
					expirationDate: new Date(expirationDate)
				})
				.returning({ id: schema.samples.id, name: schema.samples.name });

			const sampleComponents = components.map(x => ({
				id: sample[0].id,
				quantityUsed: x.quantityUsed,
				...(x.category === Category.REAGENT ? { reagentId: x.id } : { sampleId: x.id })
			}));

			await server.db.insert(schema.components).values(sampleComponents);

			return sample.length ? sample[0].name : null;
		},

		areComponentsInsufficient: async components => {
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
					structure: schema.samples.structure,
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

			const components = await server.db
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
				components
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

		changeQuantity: async (id, data) => {
			const { userId, quantityUsed, reason } = data;

			const { quantityLeft } = await server.samplesService.getSampleById(id);

			const targetValue = quantityLeft - quantityUsed;

			await server.db.insert(schema.substancesQuantityChanges).values({
				userId,
				sampleId: id,
				previousValue: quantityLeft,
				targetValue,
				changeReason: reason
			});

			const result = await server.db
				.update(schema.samples)
				.set({
					quantityLeft: targetValue
				})
				.where(eq(schema.samples.id, id))
				.returning({
					sampleName: schema.samples.name
				});

			if (targetValue === 0) {
				await server.samplesService.softDeleteSample(id);
			}

			return {
				code: 200,
				status: 'success',
				message: `Quantity of sample '${result[0].sampleName}' was changed`
			};
		},

		getSamplesQuery: (extras = {}) => {
			return server.db
				.select({
					id: schema.samples.id,
					name: schema.samples.name,
					quantityUnit: schema.samples.quantityUnit,
					quantity: schema.samples.quantity,
					quantityLeft: schema.samples.quantityLeft,
					expirationDate: schema.samples.expirationDate,
					storageLocation: {
						id: sql`${schema.storages.id}`.as('storageId'),
						name: sql`${schema.storages.name}`.as('storageName'),
						room: sql`${schema.storages.room}`.as('storageRoom'),
						description: sql`${schema.storages.description}`.as('storageDescription')
					},
					structure: schema.samples.structure,
					description: schema.samples.description,
					category: sql`'sample'`.as('category'),
					...Object.fromEntries(
						Object.entries(extras).map(([col, query]) => [
							col,
							query === 'schema' ? schema.samples[col] : query
						])
					)
				})
				.from(schema.samples)
				.innerJoin(schema.storages, eq(schema.storages.id, schema.samples.storageId))
				.where(eq(schema.samples.deleted, false));
		},

		getSamplesByStorageId: async id => {
			return await server.db
				.select({
					id: schema.samples.id,
					name: schema.samples.name,
					quantityUnit: schema.samples.quantityUnit,
					quantity: schema.samples.quantity,
					quantityLeft: schema.samples.quantityLeft,
					expirationDate: schema.samples.expirationDate,
					description: schema.samples.description,
					category: sql`'sample'`.as('category')
				})
				.from(schema.samples)
				.where(and(eq(schema.samples.storageId, id), eq(schema.samples.deleted, false)));
		},

		changeStorage: async (id, data) => {
			const { storageId, userId } = data;

			const sample = await server.samplesService.getSampleById(id);

			await server.db.insert(schema.substancesStorageChanges).values({
				sampleId: id,
				userId,
				previousStorageId: sample.storageLocation.id,
				targetStorageId: storageId
			});

			const result = await server.db
				.update(schema.samples)
				.set({ storageId })
				.where(eq(schema.samples.id, id))
				.returning({ sampleName: schema.samples.name });

			return {
				code: 200,
				status: 'success',
				message: `Storage location of sample '${result[0].sampleName}' was changed`
			};
		},

		changeName: async (id, data) => {
			const { name } = data;

			const result = await server.db
				.update(schema.samples)
				.set({ name })
				.where(eq(schema.samples.id, id))
				.returning({ sampleName: schema.samples.name });

			return {
				code: 200,
				status: 'success',
				message: `Name of the sample was changed to '${result[0].sampleName}'`
			};
		},
		changeDescription: async (id, data) => {
			const { description } = data;

			const result = await server.db
				.update(schema.samples)
				.set({ description })
				.where(eq(schema.samples.id, id))
				.returning({ sampleName: schema.samples.name });

			return {
				code: 200,
				status: 'success',
				message: `Description of sample '${result[0].sampleName}' was changed`
			};
		}
	});
}

export default fp(samplesService);
