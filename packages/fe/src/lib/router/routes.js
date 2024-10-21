import LoginLayout from './layout/login-layout.vue';
import { roles } from '../constants/roles.js';

export const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: () => import('../../dashboard/main-dashboard.vue'),
		meta: {
			title: 'Dashboard'
		}
	},
	{
		path: '/users/list',
		name: 'users-list',
		component: () => import('../../users/list/user-list.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: 'Users List'
		}
	},
	{
		path: '/users/new',
		name: 'new-user',
		component: () => import('../../users/new/add-new-user.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: 'New User'
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('../../auth/login-page/login-page.vue'),
		meta: {
			layout: LoginLayout
		}
	},
	{
		path: '/reset-password',
		name: 'reset-password',
		component: () => import('../../auth/reset-password/reset-password.vue'),
		meta: {
			layout: LoginLayout
		}
	},
	{
		path: '/users/:id',
		name: 'user-details',
		component: () => import('../../user-details/user-details.vue'),
		props: true,
		meta: {
			roles: [roles.ADMIN],
			title: 'User Details'
		}
	},
	{
		path: '/users/:id/edit',
		name: 'user-details-edit',
		component: () => import('../../user-details/user-details.vue'),
		props: true,
		meta: {
			roles: [roles.ADMIN],
			title: 'User Details'
		}
	},
	{
		path: '/profile',
		name: 'user-profile',
		component: () => import('../../profile/user-profile.vue'),
		meta: {
			title: 'User Profile'
		}
	},
	{
		path: '/samples/new',
		name: 'new-sample',
		component: () => import('../../samples/new/add-new-sample.vue'),
		meta: {
			title: 'New Sample'
		}
	},
	{
		path: '/samples/:id',
		name: 'sample-details',
		component: () => import('../../samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: 'Sample Details'
		}
	},
	{
		path: '/samples/edit/:id',
		name: 'edit-sample',
		component: () => import('../../samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: 'Edit Sample Details'
		}
	},
	{
		path: '/storages/list',
		name: 'storages-list',
		component: () => import('../../storages/list/storage-list.vue'),
		meta: {
			title: 'Storages List'
		}
	},
	{
		path: '/storages/:id',
		name: 'edit-storage',
		component: () => import('../../storages/edit/storage-edit.vue'),
		props: true,
		meta: {
			roles: [roles.ADMIN],
			title: 'Edit Storage Details'
		}
	},
	{
		path: '/storages/new',
		name: 'new-storage',
		component: () => import('../../storages/add-new/storage-new.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: 'New Storage'
		}
	},
	{
		path: '/reagents/list',
		name: 'reagents-list',
		component: () => import('../../reagents/list/reagent-list.vue'),
		meta: {
			title: 'Reagents List'
		}
	},
	{
		path: '/reagents/:id',
		name: 'reagent-details',
		component: () => import('../../reagents/details-reagent/reagent-details.vue'),
		props: true,
		meta: {
			title: 'Reagent Details'
		}
	},
	{
		path: '/reagent/:id/edit',
		name: 'reagent-details-edit',
		component: () => import('../../reagents/details-reagent/reagent-details.vue'),
		props: true,
		meta: {
			title: 'Edit Reagent Details'
		}
	},
	{
		path: '/reagents/new',
		name: 'new-reagent',
		component: () => import('../../reagents/new/add-new-reagent.vue'),
		meta: {
			title: 'New Reagent'
		}
	}
];
