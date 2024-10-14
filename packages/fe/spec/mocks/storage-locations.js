import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const storageInfo = {
	storages: [
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			room: 'Building 1, Room 12',
			name: 'Cabinet 1, shelf 3',
			description: 'This storage is located near the pool'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			room: 'Building 2, Room 23',
			name: 'Cabinet 2, shelf 4'
		}
	],
	count: 1
};

export const storageLocationHandlers = [
	http.get(api('/storages'), () => {
		return HttpResponse.json(storageInfo);
	}),
	http.get(api('/storages/:id'), req => {
		const { id } = req.params;
		const storage = storageInfo.storages.find(location => location.id === id);
		if (!storage) {
			return HttpResponse.json({ message: 'Storage location is not found' }, { status: 404 });
		}
		return HttpResponse.json(storage);
	}),
	http.post(api('/storages'), async ({ request }) => {
		const storage = await request.json();
		storageInfo.storages.push(storage);
		return HttpResponse.json({
			status: 'success',
			message: `Storage location was created`
		});
	}),
	http.put(api('/storages/:id'), async ({ request, params }) => {
		const { id } = params;
		const storage = storageInfo.storages.find(location => location.id === id);
		if (!storage) {
			return HttpResponse.json({ message: 'Storage location is not found' }, { status: 404 });
		}

		const updatedStorage = await request.json();
		Object.assign(storage, updatedStorage);
		return HttpResponse.json(
			{ status: 'success', message: `Storage location was updated` },
			{ status: 200 }
		);
	}),
	http.delete(api('/storages/:id'), async ({ params }) => {
		const { id } = params;
		const storageIndex = storageInfo.storages.findIndex(location => location.id === id);
		if (storageIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: 'Storage location is not found'
				},
				{ status: 404 }
			);
		}
		storageInfo.storages.splice(storageIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: 'Storage location was deleted'
		});
	})
];
