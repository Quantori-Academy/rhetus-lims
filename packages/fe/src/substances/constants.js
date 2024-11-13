export const checkEditedFields = (substanceFields, originalSubstance, updatedSubstanceValues) => {
	if (substanceFields.name !== originalSubstance.value.name) {
		updatedSubstanceValues.value = {
			...updatedSubstanceValues.value,
			name: substanceFields.name
		};
	}
	if (substanceFields.description !== originalSubstance.value.description) {
		updatedSubstanceValues.value = {
			...updatedSubstanceValues.value,
			description: substanceFields.description
		};
	}
	if (substanceFields.storageLocation.id !== originalSubstance.value.storageLocation.id) {
		updatedSubstanceValues.value = {
			...updatedSubstanceValues.value,
			storageId: substanceFields.storageLocation.id
		};
	}
	if (substanceFields.quantityLeft !== originalSubstance.value.quantityLeft) {
		updatedSubstanceValues.value = {
			...updatedSubstanceValues.value,
			quantityLeft: substanceFields.quantityLeft,
			quantityUsed: originalSubstance.value.quantityLeft - substanceFields.quantityLeft,
			reason: 'Experiment'
		};
	}
	return updatedSubstanceValues.value;
};
