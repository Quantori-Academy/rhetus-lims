import { count, eq } from 'drizzle-orm';
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import { schema } from '../../lib/db/schema/index.js';

const BCRYPT_SALT = 10;

async function usersService(server) {
	server.decorate('usersService', {
		createUser: async data => {
			const { username, firstName, lastName, email, password, roleId } = data;

			const hash = await bcrypt.hash(password, BCRYPT_SALT);

			const result = await server.db
				.insert(schema.users)
				.values({
					username: username.toLowerCase(),
					password: hash,
					firstName: `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)}`,
					lastName: `${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`,
					email,
					roleId,
					lastLogin: null,
					createdAt: new Date()
				})
				.returning({ username: schema.users.username });

			return result.length ? result[0].username : null;
		},

		getUserByUsername: async username => {
			const result = await server.db
				.select()
				.from(schema.users)
				.where(eq(schema.users.username, username.toLowerCase()));

			return result[0];
		},

		getUserById: async id => {
			const result = await server.db
				.select()
				.from(schema.users)
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
				.where(eq(schema.users.id, id));

			return result[0];
		},

		getUsers: async queryParams => {
			const limit = Number(queryParams.limit) || 5;
			const page = Number(queryParams.page) || 1;

			const offset = page === 1 ? 0 : (page - 1) * limit;

			// TODO: sort, filter, search

			const result = await server.db
				.select({
					id: schema.users.id,
					username: schema.users.username,
					firstName: schema.users.firstName,
					lastName: schema.users.lastName,
					email: schema.users.email,
					role: {
						id: schema.roles.id,
						name: schema.roles.name
					},
					lastLogin: schema.users.lastLogin
				})
				.from(schema.users)
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
				.limit(limit)
				.offset(offset);

			return result;
		},

		getUsersCount: async () => {
			const result = await server.db.select({ value: count() }).from(schema.users);

			return result[0].value;
		},

		updateUser: async (id, data) => {
			if ('password' in data) {
				data.password = await bcrypt.hash(data.password, BCRYPT_SALT);
			}

			const result = await server.db
				.update(schema.users)
				.set(data)
				.where(eq(schema.users.id, id))
				.returning({ username: schema.users.username });

			return result.length ? result[0].username : null;
		},

		deleteUser: async id => {
			const result = await server.db
				.delete(schema.users)
				.where(eq(schema.users.id, id))
				.returning({ username: schema.users.username });

			return result.length ? result[0].username : null;
		},

		isAdmin: async id => {
			const result = await server.usersService.getUserById(id);

			return result.roles.name === 'administrator';
		}
	});
}

export default fp(usersService);
