import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const login = {
	body: S.object().prop('username', S.string().required()).prop('password', S.string().required()),
	response: {
		200: statusMessage,
		400: statusMessage,
		401: statusMessage,
		500: statusMessage
	}
};

const logout = {
	response: {
		200: statusMessage,
		400: statusMessage,
		401: statusMessage,
		500: statusMessage
	}
};

export { login, logout };
