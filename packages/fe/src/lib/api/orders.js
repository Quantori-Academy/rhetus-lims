export default http => ({
	async fetchOrders(params) {
		return await http('/orders', { query: params });
	},
	async changeOrderStatus(id, action) {
		return await http(`/orders/${id}/change-status`, {
			method: 'PUT',
			body: action
		});
	},
	async fetchOrder(id) {
		return await http(`/orders/${id}`);
	},
	async addOrder(order) {
		return await http('/orders', {
			method: 'POST',
			body: order
		});
	},
	async updateOrder(id, order) {
		return await http(`/orders/${id}`, {
			method: 'PATCH',
			body: order
		});
	},
	async deleteOrder(id) {
		return await http(`/orders/${id}`, {
			method: 'DELETE'
		});
	}
});
