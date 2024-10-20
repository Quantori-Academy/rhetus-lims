import S from 'fluent-json-schema';
import { Storage } from '../storages/storages-schema.js';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Reagent = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('name', S.string().minLength(1).required())
	.prop('casNumber', S.string().minLength(1).required())
	.prop('producer', S.string().minLength(1).required())
	.prop('catalogId', S.string().minLength(1).required())
	.prop('catalogLink', S.string().format(S.FORMATS.URL).required())
	.prop('unitPrice', S.number().required())
	.prop('quantityUnit', S.string().minLength(1).required())
	.prop('quantity', S.number().required())
	.prop('quantityLeft', S.number().required())
	.prop('expirationDate', S.string().format(S.FORMATS.DATE_TIME).required())
	.prop('description', S.string().required())
	.prop('storageLocationId', S.string().format(S.FORMATS.UUID).required())
	.prop('category', S.string().required());

const createReagent = {
	security: [{ Session: [] }],
	body: Reagent.without(['id', 'category']),
	response: {
		201: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const getReagent = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: Reagent.without(['storageLocationId']).prop(
			'storageLocation',
			Storage.without(['createdAt'])
		),
		404: statusMessage,
		500: statusMessage
	}
};

const deleteReagent = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

export { createReagent, getReagent, deleteReagent };
