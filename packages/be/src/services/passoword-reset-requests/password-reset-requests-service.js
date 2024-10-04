import { count, eq } from 'drizzle-orm';
import { schema } from '../../lib/db/schema/index.js';
import fp from 'fastify-plugin';

async function passwordResetRequestsService(server) {
	server.decorate('passwordResetRequestsService', {
		getRequests: async () => {
			const result = await server.db.select().from(schema.passwordResetRequests);

			return result;
		},

		getRequestsByUsername: async username => {
			const result = await server.db
				.select()
				.from(schema.passwordResetRequests)
				.innerJoin(schema.users, eq(schema.passwordResetRequests.fromUserId, schema.users.id))
				.where(eq(schema.users.username, username));

			return result;
		},

		getRequestsCountByUsername: async username => {
			const result = await server.db
				.select({ value: count() })
				.from(schema.passwordResetRequests)
				.innerJoin(schema.users, eq(schema.passwordResetRequests.fromUserId, schema.users.id))
				.where(eq(schema.users.username, username));

			return result[0].value;
		},

		createRequest: async userId => {
			const result = await server.db
				.insert(schema.passwordResetRequests)
				.values({
					fromUserId: userId,
					createdAt: new Date()
				})
				.returning();

			return result[0];
		},

		updateRequestByUserId: async (userId, data) => {
			const { completed } = data;

			const result = await server.db
				.update(schema.passwordResetRequests)
				.set({
					completed,
					completedAt: completed ? new Date() : null
				})
				.where(eq(schema.passwordResetRequests.fromUserId, userId))
				.returning();

			return result[0];
		}
	});
}

export default fp(passwordResetRequestsService);
