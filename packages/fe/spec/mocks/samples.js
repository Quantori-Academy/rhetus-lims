import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const samples = [
	{
		id: 'a7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3c3b333',
		name: 'Methanol',
		components: [],
		quantityUnit: 'ml',
		size: 100,
		quantityLeft: 80,
		expirationDate: '2024-11-30',
		storageLocationId: 3,
		description: 'Used as a precursor to various chemical compounds.'
	},
	{
		id: 'a7a3d8e0-5e0b-4b0f-8b3a-4f9f4b3c3b333',
		name: 'Sodium',
		components: [],
		quantityUnit: 'g',
		size: 50,
		quantityLeft: 20,
		expirationDate: '2026-06-15',
		storageLocationId: 2,
		description: 'Essential electrolyte in the human body.'
	},
	{
		id: 'a7a3d8e1-2e0b-4b0f-8b3a-4f9f4b3c3b333',
		name: 'Chlorine',
		components: [],
		quantityUnit: 'g',
		size: 50,
		quantityLeft: 20,
		expirationDate: '2026-06-15',
		storageLocationId: 2,
		description: 'A highly reactive halogen element.'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3d3b331',
		name: 'Ethanol',
		components: [],
		quantityUnit: 'L',
		size: 5,
		quantityLeft: 3,
		expirationDate: '2025-12-31',
		storageLocationId: 1,
		description: 'A common alcohol used as a solvent and in beverages.'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3d3b334',
		name: 'Sodium Chloride',
		components: [
			'a7a3d8e0-5e0b-4b0f-8b3a-4f9f4b3c3b333',
			'a7a3d8e1-2e0b-4b0f-8b3a-4f9f4b3c3b333'
		],
		quantityUnit: 'kg',
		size: 10,
		quantityLeft: 5,
		expirationDate: '2027-01-01',
		storageLocationId: 2,
		description: 'Commonly known as table salt.'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3c3b333',
		name: 'Acetic Acid',
		components: ['a7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3c3b333'],
		quantityUnit: 'L',
		size: 2,
		quantityLeft: 2,
		expirationDate: '2025-05-20',
		storageLocationId: 3,
		description: 'A weak acid with a distinctive sour taste and pungent smell.'
	}
];

const storageLocations = [
	{
		id: 1,
		room: 'Building 1, Room 2',
		name: 'Cabinet 3, Shelf 4'
	},
	{
		id: 2,
		room: 'Building 1, Room 3',
		name: 'Cabinet 1, Shelf 2'
	},
	{
		id: 3,
		room: 'Building 2, Room 1',
		name: 'Cabinet 2, Shelf 1'
	}
];

function findSampleById(id) {
	return samples.find(sample => sample.id === id);
}

function findLocationByValue({ shelf, cabinet, room }) {
	const name = `${cabinet.trim().toLowerCase()}, ${shelf.trim().toLowerCase()}`;
	return storageLocations.find(
		location =>
			location.name.toLowerCase() === name &&
			location.room.toLowerCase() === room.trim().toLowerCase()
	);
}

export const samplesHandlers = [
	http.get(api('/samples'), () => {
		return HttpResponse.json({ samples, count: samples.length });
	}),

	http.patch(api('/samples/:id'), async ({ request, params }) => {
		const { id } = params;
		const updatedSample = await request.json();

		const sample = findSampleById(id);
		if (!sample) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Sample not found`
				},
				{ status: 404 }
			);
		}

		if (updatedSample.quantityLeft <= 0) {
			const sampleIndex = samples.findIndex(sample => sample.id === id);
			samples.splice(sampleIndex, 1);
			return HttpResponse.json({
				status: 'success',
				message: `Sample was removed successfully`
			});
		}

		const { room, shelf, cabinet } = updatedSample.storageLocation;

		const storageLocation = findLocationByValue({ shelf, cabinet, room });
		if (!storageLocation) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Location not found`
				},
				{ status: 404 }
			);
		}

		const updatedSampleData = {
			...sample,
			...updatedSample,
			storageLocationId: storageLocation.id
		};

		const sampleIndex = samples.findIndex(s => s.id === id);
		samples[sampleIndex] = updatedSampleData;

		return HttpResponse.json({
			status: 'success',
			message: `Sample was updated successfully`
		});
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
