import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const getHealthcheck = {
	response: {
		200: statusMessage,
		500: statusMessage
	}
};

export { getHealthcheck };
