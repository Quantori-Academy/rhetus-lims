import { eq, and } from 'drizzle-orm';
import fp from 'fastify-plugin';
import bcrypt from 'bcrypt';
import { schema } from '../../lib/db/schema/index.js';
import { db } from '../../lib/utils/index.js';

const BCRYPT_SALT = 10;

const formatMapping = {
	firstName: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`,
	lastName: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`,
	password: string => bcrypt.hashSync(string, BCRYPT_SALT),
	email: string => string.toLowerCase(),
	username: string => string.toLowerCase(),
	name: string => string.toLowerCase() // for role name
};

const optionsDictionary = {
	role: {
		property: 'name',
		schema: 'roles'
	},
	lastlogin: {
		property: 'lastLogin',
		schema: 'users'
	},
	firstname: {
		property: 'firstName',
		schema: 'users'
	},
	lastname: {
		property: 'lastName',
		schema: 'users'
	},
	username: {
		property: 'username',
		schema: 'users'
	},
	email: {
		property: 'email',
		schema: 'users'
	}
};

async function usersService(server) {
	server.decorate('usersService', {
		createUser: async data => {
			const { username, firstName, lastName, email, password, roleId } = data;

			const result = await server.db
				.insert(schema.users)
				.values({
					username: formatMapping.username(username),
					password: formatMapping.password(password),
					firstName: formatMapping.firstName(firstName),
					lastName: formatMapping.lastName(lastName),
					email: formatMapping.email(email),
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
					createdAt: schema.users.createdAt
				})
				.from(schema.users)
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
				.where(eq(schema.users.id, id));

			return result[0];
		},

		getUsers: async queryParams => {
			const limit = Number(queryParams.limit) || 10;
			const page = Number(queryParams.page) || 1;
			const options = queryParams.options || null;

			const offset = page === 1 ? 0 : (page - 1) * limit;

			let query = server.db
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
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id));

			if (options) {
				const filterSubQueries = db.getFormattedFilters(options, formatMapping, optionsDictionary);

				query.where(and(...filterSubQueries));
			}

			const count = await query;
			const users = await query.limit(limit).offset(offset);

			return {
				users,
				count: count.length
			};
		},

		updateUser: async (id, data) => {
			const dataForUpdate = Object.fromEntries(
				Object.entries(data).map(([key, value]) =>
					key === 'roleId' || key === 'lastLogin' ? [key, value] : [key, formatMapping[key](value)]
				)
			);

			const result = await server.db
				.update(schema.users)
				.set(dataForUpdate)
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

			return result?.role?.name === 'administrator';
		},

		isLastAdmin: async id => {
			const result = await server.db
				.select({
					id: schema.users.id
				})
				.from(schema.users)
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
				.where(eq(schema.roles.name, 'administrator'));

			return result.length === 1 && result[0].id === id;
		}
	});
}

export default fp(usersService);
