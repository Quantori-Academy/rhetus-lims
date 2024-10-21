import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

const substancesData = {
	substances: [
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
			name: 'Sodium Chloride',
			category: 'reagent',
			description: 'Common salt used in various chemical reactions and as a preservative.',
			quantityLeft: '500g',
			structure: 'Cl[Na]',
			storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			expirationDate: '2024-09-27T13:16:35.744Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b322',
			name: 'Acetic Acid',
			category: 'reagent',
			description: 'Weak acid used in the production of synthetic fibers and food preservation.',
			quantityLeft: '1L',
			structure: 'CC(=O)O',
			storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b93f5g6d6d4g6g',
			expirationDate: '2024-09-27T13:16:35.744Z'
		},
		{
			id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b999',
			name: 'Potassium Permanganate',
			category: 'sample',
			description: 'Used as an oxidant in various organic and inorganic reactions.',
			quantityLeft: '250g',
			structure: 'O=[Mn](=O)(=O)=O[O-].[K+]',
			storageLocationId: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b4t5y5y5y',
			expirationDate: '2024-09-27T13:16:35.744Z'
		}
	],
	count: 3
};

export const substancesHandlers = [
	http.get(api('/substances/storage/:id'), req => {
		const { id } = req.params;
		const filteredSubstances = substancesData.substances.filter(
			substance => substance.storageLocationId === id
		);
		return HttpResponse.json({
			substances: filteredSubstances,
			count: filteredSubstances.length
		});
	})
];
