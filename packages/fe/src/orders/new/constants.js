export const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};
export const formRef = {
	title: '',
	seller: '',
	reagentRequests: [],
	reagents: []
};

export const newSubstanceRef = {
	reagentName: '',
	quantityUnit: '',
	quantity: 1,
	amount: 1
};
export const requestRules = {
	reagentName: [{ required: true, message: `Name can't be empty`, trigger: ['blur', 'change'] }],
	quantityUnit: [{ required: true, message: `Unit can't be empty`, trigger: ['blur', 'change'] }],
	quantity: [{ required: true, message: `Quantity can't be empty`, trigger: ['blur', 'change'] }],
	amount: [{ required: true, message: `Amount can't be empty`, trigger: ['blur', 'change'] }]
};

export const formRules = {
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')],
	reagents: [requestRules],
	reagentRequests: [requestRules]
};
export const substanceRules = {
	reagentName: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
