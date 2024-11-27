export default http => ({
	async fetchReagent(id) {
		return await http(`/reagents/${id}`);
	}
});
