import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

let user = {
	id: 1,
	username: 'test1',
	firstName: 'john',
	lastName: 'white',
	email: 'john@white.com',
	role: { id: 0, name: 'Admin' },
	lastLogin: '2024-09-26T10:15:06.720Z'
}

const allUsers = new Map()
allUsers.set(user.id, user)

export const usersHandlers = [
	http.get(api('/users'), () => {
		return HttpResponse.json(Array.from(allUsers.values()));
	}),
	http.post(api('/users/new'), async ({ request }) => {
		const user = await request.json();
		const userWithId = {
			...user,
			id: allUsers.size+1
		}
		allUsers.set(userWithId.id, userWithId)
		return HttpResponse.json({
			status: 'success',
			message: `user ${user.username} was created`
		});
	}),
	http.delete(api('/users/:id'), async ({ params }) => {
		const { id } = params;
		const deletedUser = allUsers.get(Number(id))
		if(!deletedUser){
			return HttpResponse.json({
				status: 'error',
				message: `User not found`
			}, {status: 404})
		}
		allUsers.delete(Number(id))
		return HttpResponse.json({
			status: 'success',
			message: `User ${id} was deleted`
		})
	})
];
