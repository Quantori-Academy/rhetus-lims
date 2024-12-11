/* eslint-disable max-lines */

import LoginLayout from './layout/login-layout.vue';
import { roles } from '../constants/roles.js';
import Dashboard from '../../dashboard/main-dashboard.vue';
import { __ } from '../../lib/locales';

export const routes = [
	{
		path: '/',
		name: 'dashboard',
		component: Dashboard,
		meta: {
			title: __('Dashboard'),
			breadcrumb: [{ name: __('Home'), path: '/' }]
		}
	},
	{
		path: '/users/list',
		name: 'users-list',
		component: () => import('../../users/list/user-list.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: __('Users List'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Users'), path: '/users/list' }
			]
		}
	},
	{
		path: '/users/new',
		name: 'new-user',
		component: () => import('../../users/new/add-new-user.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: __('New User'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Users'), path: '/users/list' },
				{ name: __('New User'), path: '' }
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
			title: __('User Details'),
			breadcrumb: route => [
				{ name: __('Home'), path: '/' },
				{ name: __('Users'), path: '/users/list' },
				{ name: __('User'), path: '' }
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
			title: __('User Details'),
			breadcrumb: route => [
				{ name: __('Home'), path: '/' },
				{ name: __('Users'), path: '/users/list' },
				{ name: __('User'), path: '' }
			]
		}
	},
	{
		path: '/profile',
		name: 'user-profile',
		component: () => import('../../profile/user-profile.vue'),
		meta: {
			title: __('User Profile'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Profile'), path: '/profile' }
			]
		}
	},
	{
		path: '/profile/edit',
		name: 'edit-user-profile',
		component: () => import('../../profile/user-profile.vue'),
		meta: {
			title: __('Edit User Profile'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Profile'), path: '/profile' },
				{ name: __('Edit'), path: '' }
			]
		}
	},
	{
		path: '/samples/new',
		name: 'new-sample',
		component: () => import('../../substances/samples/new/add-new-sample.vue'),
		meta: {
			title: __('New Sample'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' },
				{ name: __('New Sample'), path: '' }
			]
		}
	},
	{
		path: '/samples/:id',
		name: 'sample-details',
		component: () => import('../../substances/samples/edit/edit-sample.vue'),
		props: route => ({
			id: route.params.id,
			deleted: route.query.deleted === 'true'
		}),
		meta: {
			title: __('Sample Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' },
				{ name: __('Sample'), path: '' }
			]
		}
	},
	{
		path: '/samples/edit/:id',
		name: 'edit-sample',
		component: () => import('../../substances/samples/edit/edit-sample.vue'),
		props: true,
		meta: {
			title: __('Edit Sample Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' },
				{ name: __('Sample'), path: '' }
			]
		}
	},
	{
		path: '/storages/list',
		name: 'storages-list',
		component: () => import('../../storages/list/storage-list.vue'),
		meta: {
			title: __('Storages List'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Storages'), path: '/storages/list' }
			]
		}
	},
	{
		path: '/storages/:id',
		name: 'storage-details',
		component: () => import('../../storages/details/storage-details.vue'),
		props: true,
		meta: {
			title: __('Storage Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Storages'), path: '/storages/list' },
				{ name: __('Storage'), path: '' }
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
			title: __('Edit Storage Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Storages'), path: '/storages/list' },
				{ name: __('Storage'), path: '' }
			]
		}
	},
	{
		path: '/storages/new',
		name: 'new-storage',
		component: () => import('../../storages/add-new/storage-new.vue'),
		meta: {
			roles: [roles.ADMIN],
			title: __('New Storage'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Storages'), path: '/storages/list' },
				{ name: __('New Storage'), path: '' }
			]
		}
	},
	{
		path: '/substances/list',
		name: 'substances-list',
		component: () => import('../../substances/substances-list.vue'),
		meta: {
			title: __('Substances List'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' }
			]
		}
	},
	{
		path: '/reagents/:id',
		name: 'reagent-details',
		component: () => import('../../substances/reagents/reagent-details.vue'),
		props: route => ({
			id: route.params.id,
			deleted: route.query.deleted === 'true'
		}),
		meta: {
			title: __('Reagent Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' },
				{ name: __('Reagent'), path: '' }
			]
		}
	},
	{
		path: '/reagents/:id/edit',
		name: 'reagent-details-edit',
		component: () => import('../../substances/reagents/reagent-details.vue'),
		props: true,
		meta: {
			title: __('Edit Reagent Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' },
				{ name: __('Reagent'), path: '' }
			]
		}
	},
	{
		path: '/reagents/new',
		name: 'new-reagent',
		component: () => import('../../substances/reagents/add-new-reagent.vue'),
		meta: {
			title: __('New Reagent'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Substances'), path: '/substances/list' },
				{ name: __('New Reagent'), path: '' }
			]
		}
	},
	{
		path: '/404',
		name: '404',
		component: () => import('../../error-page/404-page.vue'),
		meta: {
			layout: LoginLayout,
			title: __('Page Not Found')
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
			title: __('Orders List'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Orders'), path: '/orders/list' }
			]
		}
	},
	{
		path: '/requests',
		path: '/requests/list',
		name: 'requests-list',
		component: () => import('../../requests/request-list.vue'),
		meta: {
			title: __('Reagent Requests List'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Requests'), path: '/requests/list' }
			]
		}
	},
	{
		path: '/requests/new',
		name: 'new-request',
		component: () => import('../../requests/add-new-request.vue'),
		meta: {
			title: __('New Reagent Request'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Requests'), path: '/requests/list' },
				{ name: __('New Request'), path: '' }
			]
		}
	},
	{
		path: '/requests/:id',
		name: 'request-details',
		component: () => import('../../requests/request-details.vue'),
		props: true,
		meta: {
			title: __('Request Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Requests'), path: '/requests/list' },
				{ name: __('Request'), path: '' }
			]
		}
	},
	{
		path: '/requests/:id/edit',
		name: 'request-details-edit',
		component: () => import('../../requests/request-details.vue'),
		props: true,
		meta: {
			title: __('Edit Request'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Requests'), path: '/requests/list' },
				{ name: __('Request'), path: '' }
			]
		}
	},
	{
		path: '/orders/:id',
		name: 'order-details',
		component: () => import('../../orders/details/order-details.vue'),
		props: true,
		meta: {
			roles: [roles.PROCUREMENT_OFFICER],
			title: __('Order Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Orders'), path: '/orders/list' },
				{ name: __('Order'), path: '' }
			]
		}
	},
	{
		path: '/orders/new',
		name: 'new-order-request',
		component: () => import('../../orders/new/add-new-order.vue'),
		meta: {
			roles: [roles.PROCUREMENT_OFFICER],
			title: __('New Order'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Orders'), path: '/orders/list' },
				{ name: __('New Order'), path: '' }
			]
		}
	},
	{
		path: '/orders/:id/edit',
		name: 'order-details-edit',
		component: () => import('../../orders/details/order-details.vue'),
		props: true,
		meta: {
			roles: [roles.PROCUREMENT_OFFICER],
			title: __('Edit Order Details'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Orders'), path: '/orders/list' },
				{ name: __('Order'), path: '' }
			]
		}
	},
	{
		path: '/orders/new',
		name: 'new-order-substance',
		component: () => import('../../orders/new/add-new-order.vue'),
		meta: {
			roles: [roles.PROCUREMENT_OFFICER],
			title: __('New Order'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Orders'), path: '/orders/list' },
				{ name: __('New Order'), path: '' }
			]
		}
	},
	{
		path: '/orders/:id/complete',
		name: 'complete-order',
		props: true,
		component: () => import('../../orders/complete-order/complete-order.vue'),
		meta: {
			roles: [roles.PROCUREMENT_OFFICER],
			title: __('Complete Order'),
			breadcrumb: [
				{ name: __('Home'), path: '/' },
				{ name: __('Orders'), path: '/orders/list' },
				{ name: __('Complete Order'), path: '' }
			]
		}
	}
];
