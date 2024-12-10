import { ref } from 'vue';
import { requiredRule } from '../lib/utils/form-validation/requiredRule.js';

export const Statuses = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	CANCELED: 'canceled',
	COMPLETED: 'completed'
};

export const rules = ref({
	reagentName: [requiredRule('Reagent name')],
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
