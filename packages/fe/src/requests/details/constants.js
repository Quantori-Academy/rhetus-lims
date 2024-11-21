const requiredRule = {
	required: true
};

export const formRules = {
	reagentName: [requiredRule],
	structure: [
		{ required: false, message: 'Please enter a valid chemical structure', trigger: 'blur' }
	],
	quantity: [
		requiredRule,
		{ type: 'number', message: 'Quantity must be a number', trigger: 'blur' }
	],
	quantityUnit: [requiredRule],
	status: [requiredRule],

	createdAt: [requiredRule],
	updatedAt: [requiredRule]
};

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
