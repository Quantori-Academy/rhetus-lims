import S from 'fluent-json-schema';
import { Substance } from '../substances/substances-schema.js';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const createSample = {
	security: [{ Session: [] }],
	body: S.object()
		.prop('name', S.string().required())
		.prop('size', S.number().required())
		.prop('quantityUnit', S.string().required())
		.prop('quantityLeft', S.number().required())
		.prop('expirationDate', S.string().format(S.FORMATS.DATE_TIME).required())
		.prop('room', S.string().required())
		.prop('cabinet', S.string().required())
		.prop('shelf', S.string().required())
		.prop('description', S.string())
		.prop(
			'reagentsAndSamples',
			S.array().items(
				S.object().prop('id', S.string().required()).prop('category', S.string().required())
			)
		),
	response: {
		201: statusMessage,
		400: statusMessage,
		500: statusMessage
	}
};

const getSample = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: S.object()
			.prop('id', S.string().format(S.FORMATS.UUID).required())
			.prop('name', S.string().required())
			.prop('size', S.number().required())
			.prop('quantityUnit', S.string().required())
			.prop('quantityLeft', S.number().required())
			.prop('expirationDate', S.string().format(S.FORMATS.DATE_TIME).required())
			.prop('description', S.string())
			// TODO add location
			// .prop('storageLocation', S.object()...)
			.prop('reagentsAndSamples', S.array().items(Substance.without('storageLocationId'))),
		404: statusMessage,
		500: statusMessage
	}
};

const deleteSample = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	response: {
		200: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

const updateSample = {
	security: [{ Session: [] }],
	params: S.object().prop('id', S.string()),
	body: S.object()
		.prop('quantityLeft', S.number().minimum(0))
		.prop(
			'storageLocation',
			S.object()
				.prop('room', S.string().required())
				.prop('cabinet', S.string().required())
				.prop('shelf', S.string().required())
		),
	response: {
		200: statusMessage,
		400: statusMessage,
		404: statusMessage,
		500: statusMessage
	}
};

export { createSample, getSample, deleteSample, updateSample };
