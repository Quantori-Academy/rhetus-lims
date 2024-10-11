export default http => ({
	async fetchPaginatedItems(url) {
		return await http(url, {
			method: 'GET'
		});
	}
});
