import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

export const usersHandlers = [
	http.get(api('/users'), () => {
		return HttpResponse.json([
			{
				id: 1,
				username: 'test1',
				firstName: 'john',
				lastName: 'white',
				email: 'john@white.com',
				role: { id: 0, name: 'Admin' },
				lastLogin: '2024-09-26T10:15:06.720Z'
			}
		]);
	}),
	http.post(api('/users/new'), async ({ request }) => {
		const user = await request.json();

		return HttpResponse.json({
			status: 'success',
			message: `user ${user.username} was created`
		});
	}),
	http.delete(api('/users/:id'), async ({ params }) => {
		const { id } = params;
		if(!id){
			return HttpResponse.json({
				status: 'error',
				message: `User ${id} not found`
			}, {status: 404})
		}
		return HttpResponse.json({
			status: 'success',
			message: `User ${id} was deleted`
		})
	})
];
