import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

let userInfo = {
	users: [
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3d3b333',
			username: 'test1',
			firstName: 'john',
			lastName: 'white',
			email: 'john@white.com',
			role: {
				id: 1,
				name: 'administrator'
			},
			lastLogin: '2024-09-26T10:15:06.720Z',
			createdAt: '2024-09-27T21:47:47.481Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
			username: 'molecule_master',
			firstName: 'Anna',
			lastName: 'Smith',
			email: 'anna.smith@chemistry.com',
			role: {
				id: 1,
				name: 'administrator'
			},
			lastLogin: '2024-09-26T10:15:06.720Z',
			createdAt: '2024-09-27T21:47:47.481Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
			username: 'reaction_queen',
			firstName: 'Bella',
			lastName: 'Rogers',
			email: 'bella.rogers@organicchem.com',
			role: {
				id: 2,
				name: 'procurement officer'
			},
			lastLogin: '2024-10-05T10:15:06.720Z',
			createdAt: '2024-09-28T21:47:47.481Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
			username: 'synthesis_sorcerer',
			firstName: 'Charlie',
			lastName: 'Johnson',
			email: 'charlie.johnson@chemistryworld.com',
			role: {
				id: 3,
				name: 'researcher'
			},
			lastLogin: '2024-10-06T10:15:06.720Z',
			createdAt: '2024-09-20T21:47:47.481Z'
		}
	],
	counts: 1
};

let roleInfo = {
	roles: [
		{
			id: 1,
			name: 'administrator'
		},
		{
			id: 2,
			name: 'procurement officer'
		},
		{
			id: 3,
			name: 'researcher'
		}
	]
};

export const usersHandlers = [
	http.get(api('/roles'), () => {
		return HttpResponse.json(roleInfo);
	}),
	http.get(api('/users'), () => {
		return HttpResponse.json(userInfo);
	}),
	http.post(api('/users'), async ({ request }) => {
		const user = await request.json();
		const updatedUser = {
			...user,
			role: roleInfo.roles.find(role => role.id === user.roleId)
		};
		userInfo.users.push(updatedUser);
		return HttpResponse.json({
			status: 'success',
			message: `user ${user.username} was created`
		});
	}),
	http.get(api('/users/:id'), req => {
		const { id } = req.params;
		const user = userInfo.users.find(user => user.id === id);
		if (user) {
			return HttpResponse.json(user);
		} else {
			return HttpResponse.json({ message: 'User not found' }, { status: 404 });
		}
	}),

	http.patch(api('/users/:id'), async ({ request, params }) => {
		const { id } = params;
		const editedUser = await request.json();
		const updatedUser = {
			...editedUser,
			role: roleInfo.roles.find(role => role.id === editedUser.roleId)
		};
		const user = userInfo.users.find(user => user.id === id);
		if (user) {
			Object.assign(user, updatedUser);
			return HttpResponse.json(user);
		} else {
			return HttpResponse.json({ message: 'User not found' }, { status: 404 });
		}
	}),
	http.post(api('/users/:id/change-password'), async ({ request, params }) => {
		const { id } = params;
		const { confirm } = await request.json();
		const user = userInfo.users.find(user => user.id === id);
		if (user) {
			if (confirm) {
				return HttpResponse.json({
					status: 'success',
					message: 'Password change confirmed successfully'
				});
			} else {
				return HttpResponse.json({
					status: 'info',
					message: 'Password change canceled'
				});
			}
		} else {
			return HttpResponse.json({ message: 'User not found' }, { status: 404 });
		}
	}),
	http.delete(api('/users/:id'), async ({ params }) => {
		const { id } = params;
		const userIndex = userInfo.users.findIndex(user => user.id === id);
		if (userIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `User not found`
				},
				{ status: 404 }
			);
		}
		userInfo.users.splice(userIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: `User was deleted`
		});
	}),
	http.get(api('/me'), () => {
		const user = users[0];
		return HttpResponse.json(user);
	})
];
