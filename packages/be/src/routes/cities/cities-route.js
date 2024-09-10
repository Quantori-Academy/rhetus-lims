import fp from 'fastify-plugin';
import * as schema from './cities-schema.js';
import citiesService from '../../services/cities/cities-service.js';

async function cities(server, options) {
	await server.register(citiesService);

	server.route({
		method: 'POST',
		path: options.prefix + 'cities',
		// onRequest: [server.authenticate],
		schema: schema.insert,
		handler: onCreateCity
	});
	async function onCreateCity(req, reply) {
		const city = await server.citiesService.createCity(req.body);

		reply.code(201);
		return { city };
	}

	server.route({
		method: 'GET',
		path: options.prefix + 'cities/:id',
		// onRequest: [server.authenticate_optional],
		schema: schema.getCity,
		handler: onGetCity
	});
	async function onGetCity(req) {
		const city = await server.citiesService.getCityById(req.params.id);

		if (!city) {
			return server.httpErrors.NotFound('not found');
		} else {
			return { city };
		}
	}

	server.route({
		method: 'PUT',
		path: options.prefix + 'cities/:id',
		// onRequest: [server.authenticate],
		schema: schema.update,
		handler: onUpdateCity
	});
	async function onUpdateCity(req) {
		const city = await server.citiesService.updateCityById(req.params.id, req.body);
		if (!city) return server.httpErrors.NotFound('not found');
		return { city };
	}

	server.route({
		method: 'DELETE',
		path: options.prefix + 'cities/:id',
		// onRequest: [server.authenticate],
		schema: schema.remove,
		handler: onDeleteCity
	});
	async function onDeleteCity(req) {
		const city = await server.citiesService.deleteCityById(req.params.id);
		if (!city) return server.httpErrors.notFound('not found');
		return '';
	}
}

export default fp(cities);
