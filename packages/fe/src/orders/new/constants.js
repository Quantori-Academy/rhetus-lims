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

export const generateSubstanceRules = combinedItems => {
	const rules = {};

	combinedItems.forEach((item, index) => {
		const itemIndex = index + 1; // For human-readable index (1-based)

		// Reusable rules for each field
		rules[`combinedItems[${index}].reagentName`] = [
			requiredRule(`Reagent name for item ${itemIndex}`)
		];
		rules[`combinedItems[${index}].quantity`] = [numberFieldRule(`Quantity for item ${itemIndex}`)];
		rules[`combinedItems[${index}].quantityUnit`] = [
			requiredRule(`Quantity Unit for item ${itemIndex}`)
		];
		rules[`combinedItems[${index}].amount`] = [numberFieldRule(`Amount for item ${itemIndex}`)];
	});

	return rules;
};

export const notEmptyArrayRule = {
	validator: (rule, value) => {
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
	name: '',
	quantityUnit: '',
	quantity: 1,
	amount: 1
};
export const newSubstanceRules = {
	name: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
export const requestRules = {
	name: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
export const reagentRules = {
	name: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
export const substanceRules = {
	name: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
export const formRules = {
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')],
	reagents: [notEmptyArrayRule],
	reagentRequests: [notEmptyArrayRule],
	newReagents: [notEmptyArrayRule]
};
