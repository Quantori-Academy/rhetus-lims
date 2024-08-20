import fp from 'fastify-plugin';
import * as schema from './schema.js';
import { load } from '../../lib/utils/load.js';

async function articles(server, options) {
	const articlesModel = await load('../../models/articles.js', server.knex);

	server.route({
		method: 'GET',
		path: options.prefix + 'articles/:slug',
		// onRequest: [server.authenticate_optional],
		schema: schema.getArticle,
		handler: onGetArticle
	});
	async function onGetArticle(req) {
		const currid = req.user ? req.user.id : '';
		const article = await articlesModel.getArticle(currid, req.params.slug);
		if (!article) {
			return server.httpErrors.NotFound('not found');
		} else {
			return { article };
		}
	}

	server.route({
		method: 'POST',
		path: options.prefix + 'articles',
		// onRequest: [server.authenticate],
		schema: schema.insert,
		handler: onCreateArticle
	});
	async function onCreateArticle(req, reply) {
		const article = await articlesModel.createArticle(req.user.id, req.body.article);
		reply.code(201);
		return { article };
	}

	server.route({
		method: 'PUT',
		path: options.prefix + 'articles/:slug',
		// onRequest: [server.authenticate],
		schema: schema.update,
		handler: onUpdateArticle
	});
	async function onUpdateArticle(req) {
		const article = await articlesModel.updateArticle(
			req.user.id,
			req.params.slug,
			req.body.article
		);
		if (!article) return server.httpErrors.NotFound('not found');
		return { article };
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'articles/:slug',
		// onRequest: [server.authenticate],
		schema: schema.remove,
		handler: onDeleteArticle
	});
	async function onDeleteArticle(req) {
		const article = await articlesModel.deleteArticle(req.user.id, req.params.slug);
		if (!article) return server.httpErrors.NotFound('not found');
		return '';
	}
}

export default fp(articles);
