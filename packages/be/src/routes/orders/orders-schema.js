import S from 'fluent-json-schema';
import { OrderStatus } from '../../lib/db/schema/orders.js';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Author = S.object()
	.prop('id', S.number().minimum(1).required())
	.prop('username', S.string().minLength(1).required());

const createOrderItemSchema = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('amount', S.number().minimum(1).required())
	.prop('quantity', S.number().minimum(0).required())
	.prop('quantityUnit', S.string().minLength(1).required());

const createOrderSchema = S.object()
	.prop('title', S.string().minLength(1).maxLength(200).required())
	.prop('seller', S.string().maxLength(200))
	.prop('reagentRequests', S.array().items(createOrderItemSchema).required())
	.prop('reagents', S.array().items(createOrderItemSchema).required());

const getOrderItemSchema = S.object()
	.prop('tempId', S.string().format(S.FORMATS.UUID).required())
	.prop('amount', S.number().minimum(1).required())
	.prop('quantity', S.number().minimum(0).required())
	.prop('quantityUnit', S.string().minLength(1).required())
	.prop('reagentName', S.string().minLength(1).required())
	.prop('structure', S.string().minLength(0).required())
	.prop('casNumber', S.string().minLength(0).required())
	.prop('producer', S.string().minLength(0).required())
	.prop('catalogId', S.string().minLength(0).required())
	.prop('catalogLink', S.string().minLength(0).required())
	.prop('unitPrice', S.number().minimum(0).required());

const getOrderSchema = S.object()
	.prop('title', S.string().minLength(1).maxLength(200).required())
	.prop('seller', S.string().maxLength(200))
	.prop('reagentRequests', S.array().items(getOrderItemSchema).required())
	.prop('reagents', S.array().items(getOrderItemSchema).required())
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('createdAt', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('updatedAt', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('status', S.string().enum(Object.values(OrderStatus)).default(OrderStatus.PENDING))
	.prop('author', Author);

const updateOrderSchema = S.object()
	.prop('title', S.string().minLength(1).maxLength(200))
	.prop('seller', S.string().minLength(1).maxLength(200));

const createOrder = {
	security: [{ Session: [] }],
	body: createOrderSchema,
	response: {
		201: statusMessage,
		403: statusMessage,
		500: statusMessage
	}
};

const getOrders = {
	security: [{ Session: [] }],
	query: S.object()
		.prop('page', S.string())
		.prop('limit', S.string())
		.prop('options', S.string())
		.prop('sort', S.string()),
	response: {
		200: S.object()
			.prop('orders', S.array().items(getOrderSchema.without(['reagents', 'reagentRequests'])))
			.prop('count', S.number()),
		403: statusMessage,
		500: statusMessage
	}
};

const getOrder = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string().format(S.FORMATS.UUID).required()),
	response: {
		200: getOrderSchema,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const updateOrder = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string().format(S.FORMATS.UUID).required()),
	body: updateOrderSchema,
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const deleteOrder = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string().format(S.FORMATS.UUID).required()),
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

export { createOrder, getOrder, getOrders, updateOrder, deleteOrder };
