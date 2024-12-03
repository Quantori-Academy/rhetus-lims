import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const notifications = [
	{
		id: 'c31256c1-5ae1-43f3-9752-6fb266d6236f',
		message: "Request for 'Sodium' cancelled for the follwing reason: we have too much.",
		createdAt: '2024-11-25T15:54:35.191Z',
		orderId: '',
		requestId: '85b77fe0-3f00-45c8-8d04-54ac07ba1240'
	},
	{
		id: '9b2220db-5f3d-46ab-b569-37b33d854ea9',
		message: 'New comment from a procurement officer in request for Sodium',
		createdAt: '2024-11-25T15:51:32.181Z',
		orderId: '',
		requestId: '85b77fe0-3f00-45c8-8d04-54ac07ba1240'
	},
	{
		id: 'e08f5ea6-04b1-4916-98af-613002a4ec3f',
		message: 'New request for Sodium created.',
		createdAt: '2024-11-25T15:48:26.333Z',
		orderId: '',
		requestId: '85b77fe0-3f00-45c8-8d04-54ac07ba1240'
	},
	{
		id: 'eac0c730-a6f4-411d-83b8-49d053d30284',
		message:
			"Statuses for order 'First order for bob' and its requests were updated to 'fulfilled'.",
		createdAt: '2024-11-25T15:45:09.201Z',
		orderId: '5e39a3f5-e988-4a63-87a8-3310f75bb917',
		requestId: ''
	},
	{
		id: '4385375f-19cc-40cb-8467-c8a66396a4cf',
		message: "Statuses for order 'First order for bob' and its requests were updated to 'ordered'.",
		createdAt: '2024-11-25T15:44:44.258Z',
		orderId: '5e39a3f5-e988-4a63-87a8-3310f75bb917',
		requestId: ''
	},
	{
		id: 'aea3fd1a-38bb-47ab-87b6-c8498fce84b0',
		message: "New order 'First order for bob' created for 2 items that includes your requests.",
		createdAt: '2024-11-25T15:43:41.047Z',
		orderId: '5e39a3f5-e988-4a63-87a8-3310f75bb917',
		requestId: ''
	},
	{
		id: '201cf9a2-289c-41ea-a3fc-f7b2ad695219',
		message: 'New request for Plutonium created.',
		createdAt: '2024-11-25T15:42:42.761Z',
		orderId: '',
		requestId: '071c4a95-7006-4035-8c47-daa48b7d8945'
	},
	{
		id: '6925d2ed-df0f-49ce-ad38-adc792363059',
		message: 'New request for Uranium created.',
		createdAt: '2024-11-25T15:42:36.864Z',
		orderId: '',
		requestId: '5ac5d7c8-8833-4d0f-a70b-557d39b86fcf'
	}
];

export const notificationsHandlers = [
	http.get(api('/notifications'), async () => {
		return HttpResponse.json({ notifications, count: notifications.length });
	})
];
