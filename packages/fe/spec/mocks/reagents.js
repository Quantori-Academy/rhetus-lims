import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';
const reagents = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		name: 'Sodium Chloride',
		category: 'Reagent',
		description: 'Common salt used in various chemical reactions and as a preservative.',
		quantityLeft: '500g',
		storageLocation: 'Shelf A1',
		structure: 'Cl[Na]'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
		name: 'Acetic Acid',
		category: 'Reagent',
		description: 'Weak acid used in the production of synthetic fibers and food preservation.',
		quantityLeft: '1L',
		storageLocation: 'Cabinet B2',
		structure: 'CC(=O)O'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		name: 'Potassium Permanganate',
		category: 'Sample',
		description: 'Used as an oxidant in various organic and inorganic reactions.',
		quantityLeft: '250g',
		storageLocation: 'Shelf C3',
		structure: 'O=[Mn](=O)(=O)=O[O-].[K+]'
	}
];
const reagentDetails = [
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
		name: 'Sodium Chloride',
		category: 'Reagent',
		description: 'Common salt used in various chemical reactions and as a preservative.',
		casNumber: '7647-14-5',
		producer: 'Chemical Co.',
		catalogId: 'CH-001234',
		catalogLink: 'http://chemicalco.com/catalog/sodium-chloride',
		quantityUnit: 'g',
		quantity: 500,
		unitPrice: 12.5,
		quantityLeft: 25.0,
		storageLocation: {
			id: 1,
			name: 'Shelf A1'
		},
		expirationDate: '2025-05-15T00:00:00.000Z'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
		name: 'Acetic Acid',
		category: 'Reagent',
		description:
			'A colorless liquid organic compound with a pungent smell used in the production of various chemicals.',
		casNumber: '64-19-7',
		producer: 'Pure Chemicals',
		catalogId: 'PC-002567',
		catalogLink: 'http://purechemicals.com/catalog/acetic-acid',
		unitSize: '1 L bottle',
		unitPrice: 8.99,
		quantityLeft: 15.0,
		storageLocation: {
			id: 2,
			name: 'Cabinet B2'
		},
		expirationDate: '2024-11-30T00:00:00.000Z'
	},
	{
		id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
		name: 'Acetic Acid',
		category: 'Reagent',
		description:
			'A colorless liquid organic compound with a pungent smell used in the production of various chemicals.',
		casNumber: '64-19-7',
		producer: 'Pure Chemicals',
		catalogId: 'PC-002567',
		catalogLink: 'http://purechemicals.com/catalog/acetic-acid',
		quantityUnit: 'g',
		quantity: 1000,
		unitPrice: 8.99,
		quantityLeft: 15.0,
		storageLocation: {
			id: 2,
			name: 'Cabinet B2'
		},
		expirationDate: '2024-11-30T00:00:00.000Z'
	}
];

export const reagentsHandlers = [
	http.get(api('/reagents'), () => {
		return HttpResponse.json(reagents);
	}),
	http.get(api('/substances'), req => {
		const requestUrl = req.request.url;
		const url = new URL(requestUrl);
		const productIds = url.searchParams.get('sort');
		console.log(productIds);
		return HttpResponse.json(reagents);
	}),
	http.delete(api('/reagents/:id'), async ({ params }) => {
		const { id } = params;
		console.log(id);
		const reagentIndex = reagents.findIndex(reagent => reagent.id === id);
		if (reagentIndex === -1) {
			return HttpResponse.json(
				{
					status: 'error',
					message: `Reagent not found`
				},
				{ status: 404 }
			);
		}
		reagents.splice(reagentIndex, 1);
		return HttpResponse.json({
			status: 'success',
			message: `Reagent was deleted`
		});
	}),
	http.get(api('/reagents/:id'), req => {
		const { id } = req.params;
		const reagent = reagentDetails.find(rg => rg.id === id);
		if (reagent) {
			return HttpResponse.json(reagent);
		} else {
			return HttpResponse.json({ message: 'Reagent not found' }, { status: 404 });
		}
	}),

	http.put(api('/reagents/:id'), async ({ request, params }) => {
		const { id } = params;
		const updatedReagent = await request.json();
		const reagent = reagentDetails.find(rg => rg.id === id);
		if (reagent) {
			Object.assign(reagent, updatedReagent);
			return HttpResponse.json(reagent);
		} else {
			return HttpResponse.json({ message: 'Reagent not found' }, { status: 404 });
		}
	})
];
