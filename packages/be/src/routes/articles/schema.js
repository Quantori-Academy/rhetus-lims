import S from 'fluent-json-schema';

const Article = S.object()
	.prop('slug', S.string().required())
	.prop('title', S.string().required())
	.prop('description', S.string().required())
	.prop('body', S.string().required())
	.prop('createdAt', S.string().required())
	.prop('updatedAt', S.string().required());

const getArticle = {
	response: {
		200: S.object().prop('article', Article),
		404: S.object().prop('message', S.string())
	}
};

const insert = {
	body: S.object().prop(
		'article',
		S.object()
			.prop('title', S.string().required())
			.prop('description', S.string().required())
			.prop('body', S.string().required())
			.prop('tagList', S.array().items(S.string()).required())
	),
	response: {
		201: S.object().prop('article', Article)
	}
};

const update = {
	body: S.object().prop(
		'article',
		S.object().prop('title', S.string()).prop('description', S.string()).prop('body', S.string())
	),
	response: {
		200: S.object().prop('article', Article)
	}
};

const remove = {
	response: {
		404: S.object().prop('message', S.string())
	}
};

export { getArticle, insert, update, remove };
