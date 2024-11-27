/* eslint-disable max-lines */
import LoginLayout from './layout/login-layout.vue';
import { roles } from '../constants/roles.js';
import Dashboard from '../../dashboard/main-dashboard.vue';

export const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: Dashboard,
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
		component: () => import('../../auth/login-page.vue'),
		meta: {
			layout: LoginLayout
		}
	},
	{
		path: '/reset-password',
		name: 'reset-password',
		component: () => import('../../auth/reset-password.vue'),
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
		component: () => import('../../substances/samples/new/add-new-sample.vue'),
		meta: {
			title: 'New Sample',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' },
				{ name: 'New Sample', path: '' }
			]
		}
	},
	{
		path: '/samples/:id',
		name: 'sample-details',
		component: () => import('../../substances/samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: 'Sample Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/samples/edit/:id',
		name: 'edit-sample',
		component: () => import('../../substances/samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: 'Edit Sample Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' },
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
			title: 'Storage Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Storages', path: '/storages/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/storages/edit/:id',
		name: 'storage-details-edit',
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
		path: '/substances/list',
		name: 'substances-list',
		component: () => import('../../substances/substances-list.vue'),
		meta: {
			title: 'Substances List',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' }
			]
		}
	},
	{
		path: '/reagents/:id',
		name: 'reagent-details',
		component: () => import('../../substances/reagents/reagent-details.vue'),
		props: true,
		meta: {
			title: 'Reagent Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/reagents/:id/edit',
		name: 'reagent-details-edit',
		component: () => import('../../substances/reagents/reagent-details.vue'),
		props: true,
		meta: {
			title: 'Edit Reagent Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/reagents/new',
		name: 'new-reagent',
		component: () => import('../../substances/reagents/add-new-reagent.vue'),
		meta: {
			title: 'New Reagent',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Substances', path: '/substances/list' },
				{ name: 'New Reagent', path: '' }
			]
		}
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
	},
	{
		path: '/orders/list',
		name: 'orders-list',
		component: () => import('../../orders/list/order-list.vue'),
		meta: {
			roles: [roles.PROCUREMENT_OFFICER],
			title: 'Orders List',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Orders', path: '/orders/list' }
			]
		}
	},
	{
		path: '/requests',
		path: '/requests/list',
		name: 'requests-list',
		component: () => import('../../requests/request-list.vue'),
		meta: {
			title: 'Reagent Requests List',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Requests', path: '/requests/list' }
			]
		}
	},
	{
		path: '/requests/new',
		name: 'new-request',
		component: () => import('../../requests/add-new-request.vue'),
		meta: {
			title: 'New Reagent Request',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Requests', path: '/requests/list' },
				{ name: 'New Request', path: '' }
			]
		}
	},
	{
		path: '/requests/:id',
		name: 'request-details',
		component: () => import('../../requests/request-details.vue'),
		props: true,
		meta: {
			title: 'Request Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Requests', path: '/requests/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/requests/:id/edit',
		name: 'request-details-edit',
		component: () => import('../../requests/request-details.vue'),
		props: true,
		meta: {
			title: 'Edit Request',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Requests', path: '/requests/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/orders/:id',
		name: 'order-details',
		component: () => import('../../orders/details/order-details.vue'),
		props: true,
		meta: {
			title: 'Order Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Orders', path: '/orders/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/orders/new',
		name: 'new-order-request',
		component: () => import('../../orders/new/add-new-order.vue'),
		meta: {
			title: 'New Order',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Orders', path: '/orders/list' },
				{ name: 'New Order', path: '' }
			]
		}
	},
	{
		path: '/orders/:id/edit',
		name: 'order-details-edit',
		component: () => import('../../orders/details/order-details.vue'),
		props: true,
		meta: {
			title: 'Edit Order Details',
			breadcrumb: route => [
				{ name: 'Home', path: '/' },
				{ name: 'Orders', path: '/orders/list' },
				{ name: `${route.params.id}`, path: '' }
			]
		}
	},
	{
		path: '/orders/new',
		name: 'new-order-substance',
		component: () => import('../../orders/new/add-new-order.vue'),
		meta: {
			title: 'New Order',
			breadcrumb: [
				{ name: 'Home', path: '/' },
				{ name: 'Orders', path: '/orders/list' },
				{ name: 'New Order', path: '' }
			]
		}
	}
];
