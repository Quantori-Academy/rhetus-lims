import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { __ } from '../../lib/locales';

const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} ${__("can't be empty")}`,
		trigger: ['blur', 'change']
	};
};

export const formRules = {
	quantityLeft: [
		requiredRule(__('Quantity left')),
		{
			type: 'number',
			min: 0,
			message: __("Quantity can't be negative"),
			trigger: ['blur', 'change']
		}
	],
	name: [requiredRule(__('Name'))],
	storageId: [requiredRule(__('Storage location'))]
};

export const emptyReagent = {
	name: '',
	casNumber: '',
	producer: '',
	catalogId: '',
	catalogLink: '',
	unitPrice: '',
	quantityUnit: '',
	quantity: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageLocation: {
		id: '',
		room: '',
		name: '',
		description: ''
	},
	description: ''
};

export const confirmNotify = async message => {
	return await $confirm(`${message}`, __('Warning'), {
		confirmButtonText: __('OK'),
		cancelButtonText: __('Cancel'),
		type: 'warning'
	});
};
