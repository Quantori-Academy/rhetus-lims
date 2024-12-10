import { __ } from '../lib/locales';

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
					quantityUsed: originalSubstance.value.quantityLeft - newValue
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

export const notPastDateRule = {
	validator: (_, value) => {
		const selectedDate = new Date(value);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (selectedDate < today) {
			return Promise.reject(new Error(__('The date cannot be past date')));
		}
		return Promise.resolve();
	},
	trigger: ['blur', 'change']
};
