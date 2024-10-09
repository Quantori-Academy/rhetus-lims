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

export const reagentsHandlers = [
	http.get(api('/reagents'), () => {
		return HttpResponse.json(reagents);
	}),
	http.delete(api('/reagents/:id'), async ({ params }) => {
		const { id } = params;
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
	})
];
