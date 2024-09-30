import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
const users = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		username: 'molecule_master',
		firstName: 'Anna',
		lastName: 'Smith',
		email: 'anna.smith@chemistry.com',
		role: 'Admin',
		creationDate: '2022-04-12'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
		username: 'reaction_queen',
		firstName: 'Bella',
		lastName: 'Rogers',
		email: 'bella.rogers@organicchem.com',
		role: 'Moderator',
		creationDate: '2022-05-10'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		username: 'synthesis_sorcerer',
		firstName: 'Charlie',
		lastName: 'Johnson',
		email: 'charlie.johnson@chemistryworld.com',
		role: 'User',
		creationDate: '2022-06-15'
	}
];

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
	http.get(api('/users/:id'), req => {
		const { id } = req.params;
		const user = users.find(user => user.id === id);
		if (user) {
			return HttpResponse.json(user);
		} else {
			return HttpResponse.json({ message: 'User not found' }, { status: 404 });
		}
	}),

	http.put(api('/users/:id'), async ({ request, params }) => {
		const { id } = params;
		const updatedUser = await request.json();
		const user = users.find(user => user.id === id);
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
    const user = users.find(user => user.id === id);
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
