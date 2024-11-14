export default http => ({
	async fetchRequests(params) {
		return await http(`/requests`, { query: { options: params } });
	},
	async cancelRequest(id) {
		return await http(`/requests/${id}`, { method: 'DELETE' });
	},
	async addRequest(request) {
		return await http(`/requests`, {
			method: 'POST',
			body: request
		});
	}
});
