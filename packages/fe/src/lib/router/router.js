import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const history = createWebHistory(import.meta.env.BASE_URL);
const $router = createRouter({
	history,
	routes
});

const $route = $router.currentRoute;

export { $router, $route };
