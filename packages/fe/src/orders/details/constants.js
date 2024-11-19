export const requiredRule = fieldName => {
	return {
		required: true,
		message: `${fieldName} can't be empty`,
		trigger: ['blur', 'change']
	};
};

export const getButtonType = status => {
	switch (status) {
		case 'pending':
			return 'info';
		case 'ordered':
			return 'warning';
		case 'fulfilled':
			return 'success';
		case 'canceled':
			return 'danger';
		default:
			return 'info';
	}
};
