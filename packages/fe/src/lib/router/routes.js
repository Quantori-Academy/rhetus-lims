export const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: () => import('../../dashboard/main-dashboard.vue')
	},
	{
		path: '/form',
		name: 'form',
		component: () => import('../../form/main-form.vue')
	}
];
