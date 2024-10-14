import S from 'fluent-json-schema';

const statusMessage = S.object()
	.prop('status', S.string().required())
	.prop('message', S.string().required());

const Substance = S.object()
	.prop('id', S.string().format(S.FORMATS.UUID).required())
	.prop('name', S.string().minLength(1).required())
	.prop('category', S.string().required())
	// TODO: add structure after it will be implemented in next milestones
	// .prop('structure', S.string().required())
	.prop('description', S.string().required())
	.prop('quantityLeft', S.number().required())
	// TODO: Check is it number or string(UUID) after location management will be implemented
	.prop('storageLocationId', S.number().required())
	.prop('quantityUnit', S.string().minLength(1).required())
	.prop('quantity', S.number().required())
	.prop('expirationDate', S.string().format(S.FORMATS.DATE_TIME).required());

const getSubstances = {
	security: [{ Session: [] }],
	query: S.object()
		.prop('page', S.string())
		.prop('limit', S.string())
		.prop('options', S.string())
		.prop('sort', S.string()),
	response: {
		200: S.object()
			.prop(
				'substances',
				S.array().items(
					Substance
					// TODO: add Location schema after it will be implemented
					// .prop('location', Location)
					// .required()
				)
			)
			.prop('count', S.number()),
		500: statusMessage
	}
};

export { getSubstances };
