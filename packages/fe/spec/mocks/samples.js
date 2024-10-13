import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const samples = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3d3b331',
		name: 'Ethanol',
		reagentsAndSamples: [],
		quantityUnit: 'L',
		size: 5,
		quantityLeft: 3,
		expirationDate: '2025-12-31',
		storageLocation: {
			id: 1,
			room: 'Building 1, Room 2',
			name: 'Cabinet 3, Shelf 4'
		},
		description: 'A common alcohol used as a solvent and in beverages.'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3d3b334',
		name: 'Sodium Chloride',
		reagentsAndSamples: [
			{
				name: 'Sodium',
				reagentsAndSamples: [],
				quantityUnit: 'g',
				size: 50,
				quantityLeft: 20,
				expirationDate: '2026-06-15',
				storageLocation: {
					id: 2,
					room: 'Building 1, Room 3',
					name: 'Cabinet 1, Shelf 2'
				},
				description: 'Essential electrolyte in the human body.'
			},
			{
				name: 'Chlorine',
				reagentsAndSamples: [],
				quantityUnit: 'g',
				size: 50,
				quantityLeft: 20,
				expirationDate: '2026-06-15',
				storageLocation: {
					id: 2,
					room: 'Building 1, Room 3',
					name: 'Cabinet 1, Shelf 2'
				},
				description: 'A highly reactive halogen element.'
			}
		],
		quantityUnit: 'kg',
		size: 10,
		quantityLeft: 5,
		expirationDate: '2027-01-01',
		storageLocation: {
			id: 2,
			room: 'Building 1, Room 3',
			name: 'Cabinet 1, Shelf 2'
		},
		description: 'Commonly known as table salt.'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-4f9f4b3c3b333',
		name: 'Acetic Acid',
		reagentsAndSamples: [
			{
				name: 'Methanol',
				reagentsAndSamples: [],
				quantityUnit: 'ml',
				size: 100,
				quantityLeft: 80,
				expirationDate: '2024-11-30',
				storageLocation: {
					id: 3,
					room: 'Building 2, Room 1',
					name: 'Cabinet 2, Shelf 1'
				},
				description: 'Used as a precursor to various chemical compounds.'
			}
		],
		quantityUnit: 'L',
		size: 2,
		quantityLeft: 2,
		expirationDate: '2025-05-20',
		storageLocation: {
			id: 3,
			room: 'Building 2, Room 1',
			name: 'Cabinet 2, Shelf 1'
		},
		description: 'A weak acid with a distinctive sour taste and pungent smell.'
	},
	{
		id: 'c7b3d8e2-5e0b-4b0f-8b3a-4f9f4b3c3b333',
		name: 'Chlorine',
		reagentsAndSamples: [],
		quantityUnit: 'g',
		size: 50,
		quantityLeft: 20,
		expirationDate: '2026-06-15',
		storageLocation: {
			id: 2,
			room: 'Building 1, Room 3',
			name: 'Cabinet 1, Shelf 2'
		},
		description: 'A highly reactive halogen element.'
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

	http.post(api('/samples'), async ({ request }) => {
		const sample = await request.json();

		const { room, shelf, cabinet, ...rest } = sample;

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

		const newSample = {
			...rest,
			storageLocation,
			reagentsAndSamples: sample.reagentsAndSamples.map(findSampleById)
		};

		samples.push(newSample);
		return HttpResponse.json({
			status: 'success',
			message: `New sample was created`
		});
	}),

	http.get(api('/samples/:id'), req => {
		const { id } = req.params;
		const sample = samples.find(sample => sample.id === id);
		if (sample) {
			return HttpResponse.json(sample);
		} else {
			return HttpResponse.json({ message: 'Sample not found' }, { status: 404 });
		}
	}),

	http.delete(api('/samples/:id'), async ({ params }) => {
		const { id } = params;
		const sampleIndez = samples.findIndex(sample => sample.id === id);
		if (sampleIndez === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Sample not found`
				},
				{ status: 404 }
			);
		}
		samples.splice(sampleIndez, 1);
		return HttpResponse.json({
			status: 'success',
			message: `Sample was deleted`
		});
	})
];
