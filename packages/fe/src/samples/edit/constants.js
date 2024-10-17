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
		room: [requiredRule],
		cabinet: [requiredRule],
		shelf: [requiredRule]
	}
};

export const emptySample = {
	name: '',
	reagentsAndSamples: [],
	quantityUnit: '',
	size: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageLocation: {
		room: '',
		cabinet: '',
		shelf: ''
	},
	description: ''
};
