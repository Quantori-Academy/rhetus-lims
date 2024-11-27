import { $confirm } from '../../../lib/utils/feedback/confirm-msg';

const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};

export const formRules = {
	quantityLeft: [
		requiredRule('quantityLeft'),
		{
			type: 'number',
			min: 0,
			message: "Quantity can't be negative",
			trigger: ['blur', 'change']
		}
	],
	name: [requiredRule('Name')],
	storageId: [requiredRule('Storage location')]
};

export const emptySample = {
	name: '',
	components: [],
	quantityUnit: '',
	quantity: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageLocation: {
		id: '',
		room: '',
		name: ''
	},
	description: ''
};

export const confirmNotify = async message => {
	return await $confirm(`${message}`, 'Warning', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning'
	});
};
