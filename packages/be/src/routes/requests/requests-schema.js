import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const StatusEnum = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	DECLINED: 'declined'
};

const Author = S.object()
	.prop('id', S.number().minimum(1).required())
	.prop('username', S.string().minLength(1).required());

// TODO: add order object when it will be implemented
// const Order = S.object();

const Request = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('author', Author)
	.prop('reagentName', S.string().minLength(1).required())
	.prop('quantity', S.number().required())
	.prop('status', S.string().enum(Object.values(StatusEnum)).default(StatusEnum.PENDING))
	.prop('userComment', S.string().required())
	.prop('poComment', S.string().required())
	.prop('createdAt', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('updatedAt', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('structure', S.string().required())
	.prop('casNumber', S.string().maxLength(12).required())
	// TODO: change to order object when it will be implemented
	.prop('orderId', S.string().format(S.FORMATS.UUID).required());

const createRequest = {
	security: [{ Session: [] }],
	body: Request.without([
		'id',
		'status',
		'poComment',
		'createdAt',
		'updatedAt',
		'orderId',
		'author'
	]),
	response: {
		201: statusMessage,
		401: statusMessage,
		500: statusMessage
	}
};

const getRequest = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string().format(S.FORMATS.UUID).required()),
	response: {
		200: Request,
		// TODO: add order object
		// .prop(
		// 	'order',
		// 	Order)
		// ),
		401: statusMessage,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const getRequests = {
	security: [{ Session: [] }],
	query: S.object()
		.prop('page', S.string())
		.prop('limit', S.string())
		.prop('options', S.string())
		.prop('sort', S.string()),
	response: {
		200: S.object().prop('requests', S.array().items(Request)).prop('count', S.number()),
		401: statusMessage,
		500: statusMessage
	}
};

const deleteRequest = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string().format(S.FORMATS.UUID).required()),
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const updateRequestSchema = S.object()
	.additionalProperties(false)
	.prop('reagentName', S.string().minLength(1))
	.prop('quantity', S.number().minimum(0))
	.prop('userComment', S.string().minLength(1))
	.prop('poComment', S.string().minLength(1))
	.prop('structure', S.string().minLength(1))
	.prop('casNumber', S.string().minLength(1));

const updateRequest = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string().format(S.FORMATS.UUID).required()),
	body: updateRequestSchema,
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

export { createRequest, getRequest, getRequests, deleteRequest, updateRequest };