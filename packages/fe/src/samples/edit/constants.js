const requiredRule = {
	required: true,
	message: 'Please enter a value',
	trigger: ['blur', 'change']
};
export const formRules = {
	quantityLeft: [
		requiredRule,
		{
			type: 'number',
			min: 0,
			message: "Quantity can't be negative",
			trigger: ['blur', 'change']
		}
	],
	storageLocation: {
		id: [requiredRule]
	}
};

export const emptySample = {
	name: '',
	reagentsAndSamples: [],
	quantityUnit: '',
	quantity: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageLocation: {
		id: '',
		room: '',
		name: ''
	},
	description: ''
};
