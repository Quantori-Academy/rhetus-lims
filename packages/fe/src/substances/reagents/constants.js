import { $confirm } from '../../lib/utils/feedback/confirm-msg';
import { __ } from '../../lib/locales';

const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} ${__("can't be empty")}`,
		trigger: ['blur', 'change']
	};
};
const notPastDateRule = {
	validator: (_, value) => {
		const selectedDate = new Date(value);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (selectedDate < today) {
			return Promise.reject(new Error(__('The date cannot be past date')));
		}
		return Promise.resolve();
	},
	trigger: ['blur', 'change']
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

export const newReagentRules = {
	name: [requiredRule(__('Name'))],
	catalogLink: [{ type: 'url' }],
	quantityUnit: [requiredRule(__('Quantity unit'))],
	quantity: [
		requiredRule(__('Quantity')),
		{ type: 'number', min: 1, message: __('Quantity cannot be zero'), trigger: ['blur', 'change'] }
	],
	expirationDate: [requiredRule(__('Expiration date')), notPastDateRule],
	storageId: [requiredRule(__('Storage location'))],
	structure: [requiredRule(__('Structure'))]
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
