import S from 'fluent-json-schema';

// TODO: replace with Role schema import?s
const roles = {
	admin: 'admin',
	'procurement officer': 'procurement officer',
	researcher: 'researcher'
};

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const User = S.object()
	.prop('id', S.number().required().minimum(1))
	.prop('username', S.string().required())
	.prop('firstName', S.string().required())
	.prop('lastName', S.string().required())
	.prop('email', S.string().format(S.FORMATS.EMAIL).required())
	.prop('password', S.string().required())
	.prop('lastLogin', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('createdAt', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop(
		'role',
		S.object()
			.prop('id', S.number().minimum(1).required())
			.prop('name', S.string().enum(Object.values(roles)).required())
	);

const createUser = {
	body: User.without(['id', 'lastLogin', 'createdAt']),
	response: {
		201: statusMessage,
		403: statusMessage,
		409: statusMessage
	}
};

const getUsers = {
	params: S.object().prop('page', S.string()).prop('limit', S.string()),
	response: {
		200: S.object().prop('users', S.array().items(User.without(['password', 'createdAt']))),
		403: statusMessage
	}
};

const getUser = {
	response: {
		200: S.object().prop('user', User.without(['password', 'lastLogin'])),
		403: statusMessage
	}
};

const updateUser = {
	body: S.object()
		.prop('firstName', S.string())
		.prop('lastName', S.string())
		.prop('email', S.string().format(S.FORMATS.EMAIL))
		.prop('password', S.string())
		.prop(
			'role',
			S.object()
				.prop('id', S.number().minimum(1))
				.prop('name', S.string().enum(Object.values(roles)))
		),
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage
	}
};

const deleteUser = {
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage
	}
};

export { createUser, getUser, getUsers, updateUser, deleteUser };
