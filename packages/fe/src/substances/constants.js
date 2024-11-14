const fieldsToUpdate = {
	name: 'name',
	description: 'description',
	storageId: 'storageId',
	quantityLeft: 'quantityLeft'
};

export const checkEditedFields = (substanceFields, originalSubstance, updatedSubstanceValues) => {
	Object.keys(fieldsToUpdate).forEach(field => {
		const originalValue = originalSubstance.value[field];
		const newValue = substanceFields[field];
		if (field === 'quantityLeft') {
			if (newValue !== originalValue) {
				updatedSubstanceValues.value = {
					...updatedSubstanceValues.value,
					[fieldsToUpdate[field]]: newValue,
					quantityUsed: originalSubstance.value.quantityLeft - newValue,
					reason: 'Experiment'
				};
			}
		} else {
			if (newValue !== originalValue) {
				updatedSubstanceValues.value = {
					...updatedSubstanceValues.value,
					[fieldsToUpdate[field]]: newValue
				};
			}
		}
	});

	return updatedSubstanceValues.value;
};
