import { eq, and } from 'drizzle-orm';
import fp from 'fastify-plugin';
import { schema } from '../../lib/db/schema/index.js';
import { Status } from '../../lib/db/schema/users.js';
import { getClarifyParams } from '../../lib/utils/common/parse-params.js';
import { applyFilters } from '../../lib/utils/db/apply-filters.js';
import { helpers } from '../../lib/utils/common/helpers.js';

const formatMapping = {
	firstName: string => helpers.capitalize(string),
	lastName: string => helpers.capitalize(string),
	password: string => helpers.hash(string),
	temporaryPassword: string => (string ? helpers.hash(string) : null),
	email: string => helpers.lowercase(string),
	username: string => helpers.lowercase(string),
	name: string => helpers.lowercase(string) // for role name
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
					lastLogin: null
				})
				.returning({ username: schema.users.username });

			return result.length ? result[0].username : null;
		},

		getUserByUsername: async username => {
			const result = await server.db
				.select()
				.from(schema.users)
				.where(
					and(eq(schema.users.username, username.toLowerCase()), eq(schema.users.deleted, false))
				);

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
					createdAt: schema.users.createdAt,
					passwordResetStatus: schema.users.passwordResetStatus,
					hasPasswordResetRequests: eq(schema.users.passwordResetStatus, Status.ACTIVE),
					deleted: schema.users.deleted
				})
				.from(schema.users)
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
				.where(and(eq(schema.users.id, id), eq(schema.users.deleted, false)));

			return result[0];
		},

		getUsers: async queryParams => {
			const { options, limit, offset } = getClarifyParams(queryParams);

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
					passwordResetStatus: schema.users.passwordResetStatus,
					hasPasswordResetRequests: eq(schema.users.passwordResetStatus, Status.ACTIVE),
					lastLogin: schema.users.lastLogin
				})
				.from(schema.users)
				.innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id));

			query = applyFilters(query, { ...options, deleted: 'false' }, 'users');

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
					!Object.keys(formatMapping).includes(key)
						? [key, value]
						: [key, formatMapping[key](value)]
				)
			);

			const result = await server.db
				.update(schema.users)
				.set(dataForUpdate)
				.where(eq(schema.users.id, id))
				.returning({ username: schema.users.username });

			return result.length ? result[0].username : null;
		},

		softDeleteUser: async id => {
			const result = await server.db
				.update(schema.users)
				.set({ deleted: true })
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
		},

		handleUserUpdateWithRole: async (userId, data, permissions) => {
			const { isOwner, isAdmin } = permissions;

			if (!isAdmin) {
				return {
					code: 403,
					status: 'error',
					message: 'Sorry. You have no permissions to change role'
				};
			}
			const targetRole = await server.rolesService.getRoleById(data.roleId);

			if (!targetRole) {
				return {
					code: 404,
					status: 'error',
					message: 'No such role'
				};
			}

			const isRoleDowngrading = targetRole.name !== 'administrator';
			const isLastAdmin = await server.usersService.isLastAdmin(userId);

			if (isOwner && isRoleDowngrading && isLastAdmin) {
				return {
					code: 409,
					status: 'error',
					message: 'Sorry. You cannot update your role. You are the only system administrator.'
				};
			}

			const username = await server.usersService.updateUser(userId, data);

			return {
				code: 200,
				status: 'success',
				message: `User '${username}' was updated`
			};
		},

		isUniqUsername: async username => {
			const result = await server.db
				.select()
				.from(schema.users)
				.where(eq(schema.users.username, username.toLowerCase()));

			return result.length === 0;
		},

		isOfficer: async id => {
			const result = await server.usersService.getUserById(id);

			return result?.role?.name === 'procurement officer';
		}
	});
}

export default fp(usersService);
