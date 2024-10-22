export default http => ({
	async fetchSubstances(params) {
		return await http(`/substances`, { query: params });
	}
});
