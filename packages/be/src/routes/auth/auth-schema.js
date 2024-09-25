import S from 'fluent-json-schema';

const login = {
	body: S.object().prop('username', S.string().required()).prop('password', S.string().required()),
	response: {
		200: S.object().prop('message', S.string().required()),
		400: S.object().prop('error', S.string().required()),
		401: S.object().prop('error', S.string().required()),
		500: S.object().prop('error', S.string().required())
	}
};

export { login };
