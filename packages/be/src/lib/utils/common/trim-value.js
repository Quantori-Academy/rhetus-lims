function trimValue(value) {
	if (Array.isArray(value)) {
		return value.map(getTrimmedValue).filter(Boolean);
	}
	return getTrimmedValue(value);
}

function getTrimmedValue(value) {
	if (!value) {
		return '';
	}

	if (typeof value === 'number') {
		return value;
	}

	return value.trim();
}

export { trimValue };
