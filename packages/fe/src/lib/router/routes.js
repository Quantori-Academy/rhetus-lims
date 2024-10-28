/* eslint-disable max-lines */
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
			title: 'Users List',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Users', path: '/users/list' }
			]
		}
	},
	{
		path: '/users/new',
		name: 'new-user',
		component: () => import('../../users/new/add-new-user.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: 'New User',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Users', path: '/users/list' },
				{ name: 'New User', path: '' }
			]
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
			title: 'User Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Users', path: '/users/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},

	{
		path: '/users/:id/edit',
		name: 'user-details-edit',
		component: () => import('../../user-details/user-details.vue'),
		props: true,
		meta: {
			roles: [roles.ADMIN],
			title: 'User Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Users', path: '/users/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/profile',
		name: 'user-profile',
		component: () => import('../../profile/user-profile.vue'),
		meta: {
			title: 'User Profile',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Profile', path: '/profile' }
			]
		}
	},
	{
		path: '/profile/edit',
		name: 'edit-user-profile',
		component: () => import('../../profile/user-profile.vue'),
		meta: {
			title: 'Edit User Profile',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Profile', path: '/profile' },
				{ name: 'Edit', path: '' }
			]
		}
	},
	{
		path: '/samples/new',
		name: 'new-sample',
		component: () => import('../../samples/new/add-new-sample.vue'),
		meta: {
			title: 'New Sample',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' },
				{ name: 'New Sample', path: '' }
			]
		}
	},
	{
		path: '/samples/:id',
		name: 'sample-details',
		component: () => import('../../samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: 'Sample Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/samples/edit/:id',
		name: 'edit-sample',
		component: () => import('../../samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: 'Edit Sample Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/storages/list',
		name: 'storages-list',
		component: () => import('../../storages/list/storage-list.vue'),
		meta: {
			title: 'Storages List',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Storages', path: '/storages/list' }
			]
		}
	},
	{
		path: '/storages/:id',
		name: 'storage-details',
		component: () => import('../../storages/details/storage-details.vue'),
		props: true,
		meta: {
			title: 'Storage Details'
		}
	},
	{
		path: '/storages/edit/:id',
		name: 'edit-storage',
		component: () => import('../../storages/details/storage-details.vue'),
		props: true,
		meta: {
			roles: [roles.ADMIN],
			title: 'Edit Storage Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Storages', path: '/storages/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/storages/new',
		name: 'new-storage',
		component: () => import('../../storages/add-new/storage-new.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: 'New Storage',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Storages', path: '/storages/list' },
				{ name: 'New Storage', path: '' }
			]
		}
	},
	{
		path: '/reagents/list',
		name: 'reagents-list',
		component: () => import('../../reagents/list/reagent-list.vue'),
		meta: {
			title: 'Reagents List',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' }
			]
		}
	},
	{
		path: '/reagents/:id',
		name: 'reagent-details',
		component: () => import('../../reagents/details-reagent/reagent-details.vue'),
		props: true,
		meta: {
			title: 'Reagent Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/reagents/:id/edit',
		name: 'reagent-details-edit',
		component: () => import('../../reagents/details-reagent/reagent-details.vue'),
		props: true,
		meta: {
			title: 'Edit Reagent Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/reagents/new',
		name: 'new-reagent',
		component: () => import('../../reagents/new/add-new-reagent.vue'),
		meta: {
			title: 'New Reagent',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Reagents', path: '/reagents/list' },
				{ name: 'New Reagent', path: '' }
			]
		}
	},
	{
		path: '/storages/content/:id',
		name: 'storage-content',
		component: () => import('../../storages/view-content/storage-content.vue'),
		props: true
	},
	{
		path: '/404',
		name: '404',
		component: () => import('../../error-page/404-page.vue'),
		meta: {
			layout: LoginLayout,
			title: 'Page Not Found'
		}
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: '404' }
	}
];
