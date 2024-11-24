import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Notification = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('orderId', S.string().format(S.FORMATS.UUID))
	.prop('requestId', S.string().format(S.FORMATS.UUID))
	.prop('message', S.string().required())
	.prop('createdAt', S.string().format(S.FORMATS.DATE_TIME).required());

const getNotifications = {
	security: [{ Session: [] }],
	body: Notification,
	response: {
		201: statusMessage,
		401: statusMessage,
		500: statusMessage
	}
};

export { getNotifications };
