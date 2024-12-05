import { STATUS } from '../../lib/constants/statuses';
export const getButtonType = status => {
	switch (status) {
		case STATUS.PENDING:
			return 'info';
		case STATUS.ORDERED:
			return 'warning';
		case STATUS.FULFILLED:
			return 'success';
		case STATUS.CANCELED:
			return 'danger';
		case STATUS.COMPLETED:
			return 'primary';
		default:
			return 'info';
	}
};

export const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};
export const numberFieldRule = fieldName => {
	return {
		type: 'number',
		required: true,
		message: `${fieldName} must be a valid number`,
		trigger: ['blur', 'change']
	};
};
export const existingFieldRules = {
	required: true,
	message: `Input can't be empty`,
	trigger: 'blur'
};
export const existingNumberFieldRules = {
	type: 'number',
	required: true,
	message: `Input must be a valid number`,
	trigger: ['blur', 'change']
};
export const newSubstanceRef = {
	reagentName: '',
	quantityUnit: '',
	quantity: 1,
	amount: 1
};

export const newSubstanceRules = {
	reagentName: [requiredRule('Name')],
	quantity: [numberFieldRule('Quantity')],
	quantityUnit: [requiredRule('Unit')],
	amount: [numberFieldRule('Amount')]
};
export const notEmptyArrayRule = {
	validator: (_, value) => {
		if (value.length === 0) {
			return Promise.reject(new Error('This array cannot be empty'));
		}
		return Promise.resolve();
	},
	trigger: ['blur', 'change']
};
export const orderRef = {
	title: '',
	seller: '',
	author: {
		username: '',
		id: ''
	},
	createdAt: '',
	updatedAt: '',
	reagentRequests: [],
	reagents: [],
	newReagents: []
};
export const orderFormRules = {
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')],
	reagentRequests: [notEmptyArrayRule],
	reagents: [notEmptyArrayRule]
};
export const updatedItemsRef = {
	reagents: [],
	reagentRequests: [],
	newReagents: [],
	updates: []
};
export const itemsToRemoveRef = {
	reagents: [],
	reagentRequests: []
};
export const findUpdatedItems = (type, originalArray, currentArray, updatedItems) => {
	const handleNewItem = currentItem => {
		if (type === 'requests') {
			if (!updatedItems.reagentRequests.some(item => item.tempId === currentItem.tempId)) {
				updatedItems.reagentRequests.push({ ...currentItem });
			}
		} else if (type === 'reagents') {
			if (!updatedItems.reagents.some(item => item.tempId === currentItem.tempId)) {
				updatedItems.reagents.push({ ...currentItem });
			}
		}
	};

	const handleUpdatedItem = (currentItem, originalItem) => {
		const isUpdated = Object.keys(currentItem).some(key => currentItem[key] !== originalItem[key]);
		if (isUpdated && !updatedItems.updates.some(item => item.tempId === currentItem.tempId)) {
			updatedItems.updates.push({ ...currentItem });
		}
	};

	currentArray.forEach(currentItem => {
		const originalItem = originalArray.find(item => item.tempId === currentItem.tempId);

		if (!originalItem) {
			handleNewItem(currentItem);
		} else {
			handleUpdatedItem(currentItem, originalItem);
		}
	});
};
export async function validateSubstances(forms) {
	try {
		await Promise.all(Object.keys(forms).map(key => forms[key]?.validate?.()));
		return true;
	} catch {
		return false;
	}
}
