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
	expirationDate: [requiredRule, notPastDateRule],
	storageId: [requiredRule],
	structure: [requiredRule]
};
