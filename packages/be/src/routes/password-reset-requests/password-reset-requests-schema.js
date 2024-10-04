import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const createRequest = {
	body: S.object().prop('username', S.string().required()),
	response: {
		201: statusMessage,
		400: statusMessage,
		500: statusMessage
	}
};

const confirmRequest = {
	// security: [{ Session: [] }],
	body: S.object().prop('username', S.string().required()),
	response: {
		200: statusMessage,
		400: statusMessage,
		403: statusMessage,
		500: statusMessage
	}
};

export { createRequest, confirmRequest };
