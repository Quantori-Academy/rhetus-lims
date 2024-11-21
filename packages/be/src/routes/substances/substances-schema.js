import S from 'fluent-json-schema';
import { Storage } from '../storages/storages-schema.js';
import { User } from '../users/users-schema.js';

const Category = {
	REAGENT: 'reagent',
	SAMPLE: 'sample'
};

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Substance = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('name', S.string().minLength(1).required())
	.prop('category', S.string().required())
	.prop('description', S.string().required())
	.prop('quantityLeft', S.number().required())
	.prop('storageLocation', Storage.without(['isEmpty', 'creationDate']))
	.prop('quantityUnit', S.string().minLength(1).required())
	.prop('quantity', S.number().required())
	.prop('structure', S.string())
	.prop('expirationDate', S.string().format(S.FORMATS.DATE_TIME).required());

const getSubstances = {
	security: [{ Session: [] }],
	query: S.object()
		.prop('page', S.string())
		.prop('limit', S.string())
		.prop('options', S.string())
		.prop('sort', S.string()),
	response: {
		200: S.object().prop('substances', S.array().items(Substance)).prop('count', S.number()),
		500: statusMessage
	}
};

const changeQuantity = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	body: S.object()
		.prop('category', S.string().enum(Object.values(Category)).required())
		.prop('quantityUsed', S.number().required().minimum(0))
		.prop('quantityLeft', S.number().required().minimum(0))
		.prop('reason', S.string().required().minLength(1)),
	response: {
		200: statusMessage,
		404: statusMessage,
		409: statusMessage,
		500: statusMessage
	}
};

const updateSubstanceSchema = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	body: S.object()
		.prop('category', S.string().enum(Object.values(Category)).required())
		.prop('storageId', S.string().format(S.FORMATS.UUID)),
	response: {
		200: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const Action = {
	QUANTITY: 'quantity-update',
	STORAGE: 'storage-update',
	CREATE: 'create',
	DELETE: 'delete'
};

const HistorySchema = S.object()
	.prop('historyId', S.string().format(S.FORMATS.UUID).required())
	.prop('user', {
		userId: User.id,
		userFirstName: User.firstName,
		userLastName: User.lastName
	})
	.required()
	.prop('prevQuantityLeft', S.number().minimum(0))
	.prop('newQuantityLeft', S.number().minimum(0))
	.prop('quantityUnit', S.string().minLength(1))
	.prop('prevStorageLocation', {
		prevStorageId: Storage.id,
		prevStorageRoom: Storage.room,
		prevStorageName: Storage.name
	})
	.prop('newStorageLocation', {
		newStorageId: Storage.id,
		newStorageRoom: Storage.room,
		newStorageName: Storage.name
	})
	.prop('actionType', S.string().enum(Object.values(Action)).required())
	.prop('changeReason', S.string().minLength(1))
	.prop('modifiedDate', S.string().format(S.FORMATS.DATE_TIME).required());

const getSubstanceHistorySchema = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: S.object().prop('histories', S.array().items(HistorySchema)),
		500: statusMessage
	}
};
export {
	getSubstances,
	changeQuantity,
	Substance,
	Category,
	updateSubstanceSchema,
	getSubstanceHistorySchema
};
