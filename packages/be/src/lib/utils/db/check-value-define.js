function isDefine(trimmedData) {
	return Array.isArray(trimmedData) ? trimmedData.length > 0 : Boolean(trimmedData);
}

export { isDefine };
