export default http => ({
	async fetchRequests(params) {
		return await http(`/requests`, { query: { options: params } });
	}
});
