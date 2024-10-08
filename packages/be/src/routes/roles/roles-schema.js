import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const roles = {
	admin: 'administrator',
	procurement_officer: 'procurement officer',
	researcher: 'researcher'
};

const Role = S.object()
	.prop('id', S.number().minimum(1))
	.prop('name', S.string().enum(Object.values(roles)));

const getRoles = {
	security: [{ Session: [] }],
	response: {
		200: S.object().prop('roles', S.array().items(Role)),
		403: statusMessage,
		500: statusMessage
	}
};

export { getRoles, Role };
