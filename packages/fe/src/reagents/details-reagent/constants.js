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

export const checkEditedFields = (reagentFields, originalReagent, updatedReagentValues) => {
	if (reagentFields.name !== originalReagent.value.name) {
		updatedReagentValues.value = {
			...updatedReagentValues.value,
			name: reagentFields.name
		};
	}
	if (reagentFields.description !== originalReagent.value.description) {
		updatedReagentValues.value = {
			...updatedReagentValues.value,
			description: reagentFields.description
		};
	}
	if (reagentFields.storageLocation.id !== originalReagent.value.storageLocation.id) {
		updatedReagentValues.value = {
			...updatedReagentValues.value,
			storageId: reagentFields.storageLocation.id
		};
	}
	if (reagentFields.quantityLeft !== originalReagent.value.quantityLeft) {
		updatedReagentValues.value = {
			...updatedReagentValues.value,
			quantityLeft: reagentFields.quantityLeft,
			quantityUsed: originalReagent.value.quantityLeft - reagentFields.quantityLeft,
			reason: 'Experiment'
		};
	}
	return updatedReagentValues.value;
};
