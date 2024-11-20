export const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};

export const ORDER_STATUS = {
	PENDING: 'pending',
	ORDERED: 'ordered',
	FULFILLED: 'fulfilled',
	CANCELED: 'canceled'
};

export const getButtonType = status => {
	switch (status) {
		case ORDER_STATUS.PENDING:
			return 'info';
		case ORDER_STATUS.ORDERED:
			return 'warning';
		case ORDER_STATUS.FULFILLED:
			return 'success';
		case ORDER_STATUS.CANCELED:
			return 'danger';
		default:
			return 'info';
	}
};

export const newSubstanceRef = {
	reagentName: '',
	quantityUnit: '',
	quantity: 1,
	amount: 1
};
export const substanceRules = {
	reagentName: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
export const requestRules = {
	reagentName: [requiredRule('Name')],
	quantityUnit: [requiredRule('Unit')],
	quantity: [requiredRule('Quantity')],
	amount: [requiredRule('Amount')]
};
export const orderFormRules = {
	title: [requiredRule('Title')],
	seller: [requiredRule('Seller')],
	reagents: [requestRules],
	reagentRequests: [requestRules]
};
