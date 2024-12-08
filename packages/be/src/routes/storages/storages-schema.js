import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Storage = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('room', S.string().required().maxLength(300))
	.prop('name', S.string().required().maxLength(300))
	.prop('description', S.string())
	.prop('creationDate', S.string().format(S.FORMATS.DATE_TIME).required());

const createStorage = {
	security: [{ Session: [] }],
	body: Storage.without(['id', 'creationDate']),
	response: {
		201: statusMessage,
		400: statusMessage,
		500: statusMessage
	}
};

const StorageWithIsEmpty = Storage.prop('isEmpty', S.boolean().required());

const getStorages = {
	security: [{ Session: [] }],
	response: {
		200: S.object().prop('storages', S.array().items(StorageWithIsEmpty)).prop('count', S.number()),
		500: statusMessage
	}
};

const getStorage = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: StorageWithIsEmpty,
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
		409: statusMessage,
		500: statusMessage
	}
};

const getStoragesNames = {
	security: [{ Session: [] }],
	response: {
		200: S.object().prop('names', S.array().items(S.string())),
		500: statusMessage
	}
};

const getStoragesRooms = {
	security: [{ Session: [] }],
	response: {
		200: S.object().prop('rooms', S.array().items(S.string())),
		500: statusMessage
	}
};

const getStoragesRoomsNames = {
	security: [{ Session: [] }],
	response: {
		200: S.object().prop(
			'roomsNames',
			S.array().items(S.object().prop('room', S.string()).prop('name', S.string()))
		),
		500: statusMessage
	}
};

export {
	createStorage,
	getStorages,
	getStorage,
	updateStorage,
	deleteStorage,
	Storage,
	getStoragesNames,
	getStoragesRooms,
	getStoragesRoomsNames
};
