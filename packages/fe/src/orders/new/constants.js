export const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};
export const numberFieldRule = fieldName => {
	return {
		type: 'number',
		required: true,
		message: `${fieldName} must be a valid number`,
		trigger: ['blur', 'change']
	};
};
export const fieldRules = {
	required: true,
	message: `Input can't be empty`,
	trigger: 'blur'
};
export const numberFieldRules = {
	type: 'number',
	required: true,
	message: `Input must be a valid number`,
	trigger: ['blur', 'change']
};
export const newSubstanceRules = {
	reagentName: [requiredRule('Name')],
	quantity: [numberFieldRule('Quantity')],
	quantityUnit: [requiredRule('Unit')],
	amount: [numberFieldRule('Amount')]
};
export const notEmptyArrayRule = {
	validator: (_, value) => {
		if (value.length === 0) {
			return Promise.reject(new Error('This array cannot be empty'));
		}
		return Promise.resolve();
	},
	trigger: ['blur', 'change']
};

export const formRef = {
	title: '',
	seller: '',
	reagentRequests: [],
	reagents: [],
	newReagents: []
};

export const newSubstanceRef = {
	reagentName: '',
	quantityUnit: '',
	quantity: 1,
	amount: 1
};

export const formRules = {
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')],
	reagents: [notEmptyArrayRule],
	reagentRequests: [notEmptyArrayRule],
	newReagents: [notEmptyArrayRule]
};
