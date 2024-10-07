import S from 'fluent-json-schema';
import { Role } from '../roles/roles-schema.js';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const User = S.object()
	.prop('id', S.number().required().minimum(1))
	.prop('username', S.string().required())
	.prop('firstName', S.string().required())
	.prop('lastName', S.string().required())
	.prop('email', S.string().format(S.FORMATS.EMAIL).required())
	.prop('password', S.string().required().minLength(8))
	.prop('lastLogin', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('createdAt', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('roleId', S.number().required().minimum(1));

const createUser = {
	security: [{ Session: [] }],
	body: User.without(['id', 'lastLogin', 'createdAt']),
	response: {
		201: statusMessage,
		403: statusMessage,
		409: statusMessage,
		500: statusMessage
	}
};

const getUsers = {
	security: [{ Session: [] }],
	query: S.object().prop('page', S.string()).prop('limit', S.string()).prop('options', S.string()),
	response: {
		200: S.object()
			.prop(
				'users',
				S.array().items(
					User.without(['password', 'createdAt', 'roleId'])
						.prop('role', Role)
						.required()
						.prop('hasPasswordResetRequests', S.boolean().required())
				)
			)
			.prop('count', S.number()),
		403: statusMessage,
		500: statusMessage
	}
};

const getUser = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: User.without(['password', 'lastLogin', 'roleId'])
			.prop('role', Role)
			.required()
			.prop('hasPasswordResetRequests', S.boolean().required()),
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const updateUserSchema = S.object()
	.additionalProperties(false)
	.prop('firstName', S.string())
	.prop('lastName', S.string())
	.prop('email', S.string().format(S.FORMATS.EMAIL))
	.prop('password', S.string())
	.prop('roleId', S.number().minimum(1));

const updateUser = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	body: updateUserSchema,
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		409: statusMessage,
		500: statusMessage
	}
};

const deleteUser = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		409: statusMessage,
		500: statusMessage
	}
};

export { createUser, getUser, getUsers, updateUser, deleteUser };
