export const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};

export const emptyReagent = {
	name: '',
	casNumber: '',
	producer: '',
	catalogId: '',
	catalogLink: '',
	unitPrice: '',
	quantityUnit: '',
	quantity: 1,
	quantityLeft: 1,
	expirationDate: '',
	storageLocation: {
		id: '',
		room: '',
		name: '',
		description: ''
	},
	description: ''
};
