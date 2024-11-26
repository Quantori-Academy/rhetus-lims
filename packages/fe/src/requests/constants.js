import { ref } from 'vue';
import { requiredRule } from '../lib/utils/form-validation/requiredRule.js';

export const Statuses = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	CANCELED: 'canceled'
};

export const rules = ref({
	reagentName: [requiredRule('Reagent Name')],
	quantityUnit: [requiredRule('Quantity unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
});

export const emptyRequest = {
	id: null,
	reagentName: '',
	structure: '',
	casNumber: '',
	quantity: null,
	quantityUnit: '',
	status: '',
	userComment: '',
	poComment: '',
	createdAt: '',
	updatedAt: ''
};
