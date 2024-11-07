export default http => ({
	async fetchRequests(params) {
		return await http(`/requests`, { query: { options: params } });
	},
	async cancelRequest(id) {
		return await http(`/requests/${id}`, { method: 'DELETE' });
	}
});
