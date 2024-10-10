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
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../../login/login-page.vue')
	},
	{
		path: '/reset-password',
		name: 'reset-password',
		component: () => import('../../reset-password/reset-password.vue')
	},
	{
		path: '/users/:id',
		name: 'user-details',
		component: () => import('../../user-details/user-details.vue'),
		props: true
	},
	{
		path: '/samples/new',
		name: 'new-sample',
		component: () => import('../../samples/new/add-new-sample.vue')
	},
	{
		path: '/storages/list',
		name: 'storages-list',
		component: () => import('../../storage-management/list/storage-management-list.vue')
	},
	{
		path: '/storages/:id',
		name: 'edit-storage',
		component: () => import('../../storage-management/edit/storage-management-edit.vue'),
		props: true
	},
	{
		path: '/storages/new',
		name: 'new-storage',
		component: () => import('../../storage-management/add-new/storage-management-new.vue')
	},
];
