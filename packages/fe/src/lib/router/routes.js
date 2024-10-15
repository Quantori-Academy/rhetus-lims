import LoginLayout from './layout/login-layout.vue';

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
		component: () => import('../../login/login-page.vue'),
		meta: {
			layout: LoginLayout
		}
	},
	{
		path: '/reset-password',
		name: 'reset-password',
		component: () => import('../../reset-password/reset-password.vue'),
		meta: {
			layout: LoginLayout
		}
	},
	{
		path: '/users/:id',
		name: 'user-details',
		component: () => import('../../user-details/user-details.vue'),
		props: true
	},
	{
		path: '/profile',
		name: 'user-profile',
		component: () => import('../../profile/user-profile.vue')
	},
	{
		path: '/samples/new',
		name: 'new-sample',
		component: () => import('../../samples/new/add-new-sample.vue')
	},
	{
		path: '/storages/list',
		name: 'storages-list',
		component: () => import('../../storages/list/storage-list.vue')
	},
	{
		path: '/storages/:id',
		name: 'edit-storage',
		component: () => import('../../storages/edit/storage-edit.vue'),
		props: true
	},
	{
		path: '/storages/new',
		name: 'new-storage',
		component: () => import('../../storages/add-new/storage-new.vue')
	},
	{
		path: '/reagents/list',
		name: 'reagents-list',
		component: () => import('../../reagents/list/reagent-list.vue')
	}
];
