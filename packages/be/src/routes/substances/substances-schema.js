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
	.prop('quantity', S.number().minimum(0).required())
	.prop('quantityUnit', S.string().minLength(1).required())
	.prop('quantityLeft', S.number().minimum(0).required())
	.prop('category', S.string().enum(Object.values(Category)).required())
	.prop('expirationDate', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('storageLocation', Storage.without(['isEmpty', 'creationDate']))
	.prop('structure', S.string().required().minLength(0))
	.prop('description', S.string().required().minLength(0))
	.prop('orderId', S.string().format(S.FORMATS.UUID));

const createSubstanceSchema = Substance.without(['id', 'storageLocation'])
	.prop('storageId', S.string().format(S.FORMATS.UUID).required())
	.ifThenElse(
		S.object().prop('category', S.const(Category.REAGENT)),
		S.object()
			.prop('casNumber', S.string().minLength(0))
			.prop('producer', S.string().minLength(0))
			.prop('catalogId', S.string().minLength(0))
			.prop('catalogLink', S.string().format(S.FORMATS.URL).minLength(0))
			.prop('unitPrice', S.number().minimum(0)),
		S.object()
			.prop(
				'components',
				S.array().items(
					S.object()
						.prop('id', S.string().format(S.FORMATS.UUID).required())
						.prop('quantityUsed', S.number().minimum(0).required())
						.prop('category', S.string().enum(Object.values(Category)).required())
				)
			)
			.required()
	);

const getSubstanceSchema = Substance.ifThenElse(
	S.object().prop('category', S.const(Category.REAGENT)),
	S.object()
		.prop('casNumber', S.string().minLength(0).required())
		.prop('producer', S.string().minLength(0).required())
		.prop('catalogId', S.string().minLength(0).required())
		.prop('catalogLink', S.string().format(S.FORMATS.URL).minLength(0).required())
		.prop('unitPrice', S.number().minimum(0).required()),
	S.object().prop(
		'components',
		S.array().items(
			Substance.without('storageLocation').prop('quantityUsed', S.number().minimum(0).required())
		)
	)
);

const getSubstancesSchema = S.object()
	.prop('substances', S.array().items(Substance).minItems(0).required())
	.prop('count', S.number().minimum(0).required());

const changeQuantitySchema = S.object()
	.prop('category', S.string().enum(Object.values(Category)).required())
	.prop('quantityUsed', S.number().required().minimum(0))
	.prop('quantityLeft', S.number().required().minimum(0))
	.prop('reason', S.string().required().minLength(1));

const updateSubstanceSchema = S.object()
	.prop('category', S.string().enum(Object.values(Category)).required())
	.prop('storageId', S.string().format(S.FORMATS.UUID));

const paramsId = S.object().prop('id', S.string().format(S.FORMATS.UUID).required());
const paramsIdWithCategory = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('category', S.string().enum(Object.values(Category)).required());

const getSubstances = {
	security: [{ Session: [] }],
	query: S.object()
		.prop('page', S.string())
		.prop('limit', S.string())
		.prop('options', S.string())
		.prop('sort', S.string()),
	response: {
		200: getSubstancesSchema,
		500: statusMessage
	}
};

const changeQuantity = {
	security: [{ Session: [] }],
	params: paramsId,
	body: changeQuantitySchema,
	response: {
		200: statusMessage,
		404: statusMessage,
		409: statusMessage,
		500: statusMessage
	}
};

const updateSubstance = {
	security: [{ Session: [] }],
	params: paramsId,
	body: updateSubstanceSchema,
	response: {
		200: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const actions = {
	QUANTITY: 'quantity-update',
	STORAGE: 'storage-update',
	DELETE: 'delete'
};

const HistorySchema = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('user', {
		userId: User.id,
		userFirstName: User.firstName,
		userLastName: User.lastName
	})
	.required()
	.prop('prevQuantityLeft', S.anyOf([S.number(), S.null()]))
	.prop('newQuantityLeft', S.anyOf([S.number(), S.null()]))
	.prop('quantityUnit', S.anyOf([S.string(), S.null()]))
	.prop(
		'prevStorageLocation',
		S.anyOf[
			({
				prevStorageId: Storage.id,
				prevStorageRoom: Storage.room,
				prevStorageName: Storage.name
			},
			S.null())
		]
	)
	.prop(
		'newStorageLocation',
		S.anyOf[
			({
				newStorageId: Storage.id,
				newStorageRoom: Storage.room,
				newStorageName: Storage.name
			},
			S.null())
		]
	)
	.prop('actionType', S.string().enum(Object.values(actions)).required())
	.prop('changeReason', S.anyOf([S.string(), S.null()]))
	.prop('isDeleted', S.boolean())
	.prop('modifiedDate', S.string().format(S.FORMATS.DATE_TIME).required());

const getSubstanceHistorySchema = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: S.object().prop('histories', S.array().items(HistorySchema)),
		500: statusMessage
	}
};
const createSubstance = {
	security: [{ Session: [] }],
	body: createSubstanceSchema,
	response: {
		201: statusMessage,
		400: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const getSubstance = {
	security: [{ Session: [] }],
	params: paramsIdWithCategory,
	response: {
		200: getSubstanceSchema,
		404: statusMessage,
		500: statusMessage
	}
};

const deleteSubstance = {
	security: [{ Session: [] }],
	params: paramsIdWithCategory,
	response: {
		200: statusMessage,
		403: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

export {
	getSubstances,
	changeQuantity,
	Substance,
	Category,
	updateSubstanceSchema,
	getSubstanceHistorySchema,
	updateSubstance,
	createSubstance,
	getSubstance,
	deleteSubstance
};
