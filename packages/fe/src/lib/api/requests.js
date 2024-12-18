export default http => ({
	async fetchRequests(params) {
		return await http(`/requests`, { query: params });
	},
	async cancelRequest(id, reason) {
		return await http(`/requests/${id}/cancel`, {
			method: 'PUT',
			body: reason
		});
	},
	async addRequest(request) {
		return await http(`/requests`, {
			method: 'POST',
			body: request
		});
	},
	async fetchRequest(id) {
		return await http(`/requests/${id}`);
	},
	async updateRequest(id, requestData) {
		return await http(`/requests/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(requestData)
		});
	},
	async fetchRequestsHistory(id) {
		return await http(`/requests/history/${id}`);
	}
});
