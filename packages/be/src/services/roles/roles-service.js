import { count, eq } from 'drizzle-orm';
import { schema } from '../../lib/db/schema/index.js';
import fp from 'fastify-plugin';

async function rolesService(server) {
	server.decorate('rolesService', {
		getRoleByName: async name => {
			const result = await server.db
				.select()
				.from(schema.roles)
				.where(eq(schema.roles.name, name.toLowerCase()));

			return result[0];
		},

		getRoleById: async id => {
			const result = await server.db.select().from(schema.roles).where(eq(schema.roles.id, id));

			return result[0];
		},

		getRoles: async () => {
			const result = await server.db.select().from(schema.roles);

			return result;
		},

		getRolesCount: async () => {
			const result = await server.db.select({ value: count() }).from(schema.roles);

			return result[0].value;
		}
	});
}

export default fp(rolesService);
