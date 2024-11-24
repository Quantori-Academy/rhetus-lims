function getClarifyParams(queryParams) {
	const defaultSort = { default: 'desc' };

	const limit = Number(queryParams.limit) || 10;
	const page = Number(queryParams.page) || 1;
	const options = queryParams.options ? JSON.parse(queryParams.options) : null;
	const sort = queryParams.sort ? JSON.parse(queryParams.sort) : defaultSort;

	const offset = page === 1 ? 0 : (page - 1) * limit;

	return {
		options,
		sort,
		limit,
		offset
	};
}

export { getClarifyParams };
