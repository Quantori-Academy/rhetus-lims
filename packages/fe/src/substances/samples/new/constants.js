import { __ } from '../../../lib/locales';

const requiredRule = {
	required: true,
	message: __('Please enter a value'),
	trigger: ['blur', 'change']
};

export const formRules = {
	name: [requiredRule],
	components: [requiredRule],
	quantityUnit: [requiredRule],
	quantity: [
		requiredRule,
		{ type: 'number', min: 0, message: __('Size cannot be negative'), trigger: ['blur', 'change'] }
	],
	quantityLeft: [
		requiredRule,
		{
			type: 'number',
			min: 0,
			message: __("You can't add a sample that has none left"),
			trigger: ['blur', 'change']
		}
	],
	expirationDate: [requiredRule],
	storageId: [requiredRule],
	structure: [requiredRule]
};

export const emptyComponent = {
	id: '',
	label: __('Select substance'),
	quantityUsed: 0,
	quantityLeft: 0,
	quantityUnit: '',
	category: ''
};
