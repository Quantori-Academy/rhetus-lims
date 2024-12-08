import { __ } from '../../../lib/locales';

const requiredRule = {
	required: true,
	message: __('Please enter a value'),
	trigger: ['blur', 'change']
};
export const notEmptyArrayRule = {
	validator: (_, value) => {
		if (value.length === 0) {
			return Promise.reject(new Error(`You can't create a sample without substances`));
		}
		return Promise.resolve();
	},
	trigger: ['submit']
};
export const formRef = {
	name: '',
	components: [],
	quantityUnit: '',
	quantity: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageId: '',
	structure: '',
	description: ''
};

export const formRules = {
	name: [requiredRule],
	components: [notEmptyArrayRule],
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
