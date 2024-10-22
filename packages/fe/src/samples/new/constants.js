const requiredRule = {
	required: true,
	message: 'Please enter a value',
	trigger: ['blur', 'change']
};

export const formRules = {
	name: [requiredRule],
	components: [requiredRule],
	quantityUnit: [requiredRule],
	quantity: [
		requiredRule,
		{ type: 'number', min: 0, message: 'Size cannot be negative', trigger: ['blur', 'change'] }
	],
	quantityLeft: [
		requiredRule,
		{
			type: 'number',
			min: 0,
			message: "You can't add a sample that has none left",
			trigger: ['blur', 'change']
		}
	],
	expirationDate: [requiredRule],
	storageId: [requiredRule]
};

export const emptyComponent = {
	id: '',
	label: 'Select reagent',
	quantityUsed: 0,
	quantityLeft: 0,
	quantityUnit: '',
	category: ''
};
