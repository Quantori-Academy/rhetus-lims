function trimValue(value) {
	if (Array.isArray(value)) {
		return value.map(item => (item ? item.trim() : '')).filter(Boolean);
	}
	return value ? value.trim() : '';
}

export { trimValue };