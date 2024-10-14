import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Storage = S.object()
	.prop('id', S.number().required().minimum(1))
	.prop('room', S.string().required().maxLength(300))
	.prop('name', S.string().required().maxLength(300))
	.prop('description', S.string())
	.prop('createdAt', S.string().format(S.FORMATS.DATE_TIME).required());

const createStorage = {
	security: [{ Session: [] }],
	body: Storage.without(['id', 'createdAt']),
	response: {
		201: statusMessage,
		500: statusMessage
	}
};

const getStorages = {
	response: {
		200: S.object()
			.prop('storages', S.array().items(Storage.without(['createdAt'])))
			.prop('count', S.number()),
		500: statusMessage
	}
};

const getStorage = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: Storage.without(['createdAt']),
		404: statusMessage,
		500: statusMessage
	}
};

const updateStorageSchema = S.object()
	.additionalProperties(false)
	.prop('room', S.string())
	.prop('name', S.string())
	.prop('description', S.string());

const updateStorage = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	body: updateStorageSchema,
	response: {
		200: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const deleteStorage = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

export { createStorage, getStorages, getStorage, updateStorage, deleteStorage };
