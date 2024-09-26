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
	},
	{
		path: '/users/list',
		name: 'users-list',
		component: () => import('../../users/list/user-list.vue')
	},
	{
		path: '/users/new',
		name: 'new-user',
		component: () => import('../../users/new/add-new-user.vue')
	}
];
