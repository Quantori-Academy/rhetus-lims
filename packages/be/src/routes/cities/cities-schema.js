import S from 'fluent-json-schema';

const PopularityEnum = S.enum(['unknown', 'known', 'popular']).required();

const City = S.object()
	.prop('id', S.string().required())
	.prop('name', S.string().required())
	.prop('popularity', PopularityEnum);

const getCity = {
	response: {
		200: S.object().prop('city', City),
		404: S.object().prop('message', S.string())
	}
};

const insert = {
	body: S.object().prop('name', S.string().required()).prop('popularity', PopularityEnum),
	response: {
		201: S.object().prop('city', City)
	}
};

const update = {
	params: S.object().prop('id', S.string()),
	body: S.object().prop('name', S.string().required()).prop('popularity', PopularityEnum),
	response: {
		200: S.object().prop('city', City)
	}
};

const remove = {
	response: {
		404: S.object().prop('message', S.string())
	}
};

export { getCity, insert, update, remove };
