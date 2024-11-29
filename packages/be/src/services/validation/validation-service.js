import fp from 'fastify-plugin';
import { helpers } from '../../lib/utils/common/helpers.js';

async function validationService(server) {
	server.decorate('validationService', {
		validateUser: async userId => {
			const user = await server.usersService.getUserById(userId);

			if (!user) {
				const error = new Error('No such user');
				error.statusCode = 404;
				throw error;
			}

			return;
		},

		validateRole: async roleId => {
			const role = await server.rolesService.getRoleById(roleId);

			if (!role) {
				const error = new Error('No such role');
				error.statusCode = 404;
				throw error;
			}

			return;
		},

		validateStorageLocation: async storageId => {
			const storage = await server.storagesService.getStorageById(storageId);

			if (!storage) {
				const error = new Error(`No such storage location with id: ${storageId} found`);
				error.statusCode = 404;
				throw error;
			}

			return;
		},

		validateOrder: async orderId => {
			const order = await server.ordersService.getOrderById(orderId);

			if (!order) {
				const error = new Error(`No such order`);
				error.statusCode = 404;
				throw error;
			}

			return;
		},

		validateRequest: async requestId => {
			const request = await server.requestsService.getRequestById(requestId);

			if (!request) {
				const error = new Error(`No such reagent request`);
				error.statusCode = 404;
				throw error;
			}

			return;
		},

		validateSubstance: async (id, category) => {
			const substance = await server.substancesService.getSubstanceById(id, category);

			if (!substance) {
				const error = new Error(`No such ${helpers.lowercase(category)}`);
				error.statusCode = 404;
				throw error;
			}

			return;
		},

		validateStructure: async structure => {
			const isStructureValid = await server.substancesService.isStructureValid(structure);

			if (!isStructureValid) {
				const error = new Error('Invalid structure');
				error.statusCode = 400;
				throw error;
			}

			return;
		}
	});
}

export default fp(validationService);
