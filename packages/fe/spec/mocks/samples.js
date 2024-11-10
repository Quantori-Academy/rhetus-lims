import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

export const samples = [
	{
		id: '3fa85f64-5717-4562-b3fb-2c963f66afa6',
		name: 'Water (H2O)',
		category: 'Sample',
		description: 'A universal solvent',
		quantityLeft: 1000,
		quantityUnit: 'ml',
		storageLocation: 'Building 1, Room 12'
	},
	{
		id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',
		name: 'Super water',
		category: 'Sample',
		description: 'Tastes yum.',
		quantityUnit: 'g',
		quantityLeft: 300,
		storageLocation: 'Building 1, Room 12'
	}
];

const samplesDetails = [
	{
		id: '3fa85f64-5717-4562-b3fc-2c963f66afb6',
		name: 'Super water',
		category: 'Sample',
		quantity: 500,
		quantityUnit: 'ml',
		quantityLeft: 300,
		expirationDate: '2025-10-19T00:00:00.000Z',
		description: 'Tastes yum.',
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			room: 'Building 1, Room 12',
			name: 'Cabinet 1, shelf 3'
		},
		components: [
			{
				id: '3fa85f64-5717-4562-b3fb-2c963f66afa6',
				name: 'Water (H2O)',
				category: 'Sample',
				description: 'A universal solvent.',
				quantityLeft: 1000,
				quantityUnit: 'ml',
				quantity: 1000,
				quantityUsed: 200
			}
		]
	},
	{
		id: '3fa85f64-5717-4562-b3fb-2c963f66afa6',
		name: 'Water (H2O)',
		category: 'Sample',
		quantity: 500,
		quantityLeft: 1000,
		quantityUnit: 'ml',
		expirationDate: '2025-10-19T00:00:00.000Z',
		description: 'A universal solvent',
		storageLocation: {
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			room: 'Building 1, Room 12',
			name: 'Cabinet 1, shelf 3'
		},
		components: []
	}
];

export const samplesHandlers = [
	http.post(api('/samples'), async ({ request }) => {
		const sample = await request.json();
		samples.push({ ...sample, category: 'sample' });
		return HttpResponse.json({
			status: 'success',
			message: `New sample was created`
		});
	}),

	http.get(api('/samples/:id'), req => {
		const sample = samplesDetails.find(sample => sample.id === req.params.id);
		if (sample) {
			return HttpResponse.json(sample);
		} else {
			return HttpResponse.json({ message: 'Sample not found' }, { status: 404 });
		}
	}),

	http.delete(api('/samples/:id'), async ({ params }) => {
		const { id } = params;
		const sampleIndex = samples.findIndex(sample => sample.id === id);
		if (sampleIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Sample not found`
				},
				{ status: 404 }
			);
		}
		samples.splice(sampleIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: `Sample was deleted`
		});
	})
];
