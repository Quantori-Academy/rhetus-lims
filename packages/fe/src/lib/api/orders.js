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
	async removeItemFromOrder(id, payload) {
		return await http(`/orders/${id}/remove-item`, {
			method: 'PUT',
			body: payload
		});
	},
	async addItemToOrder(id, payload) {
		return await http(`/orders/${id}/add-item`, {
			method: 'PUT',
			body: payload
		});
	},
	async updateItemInOrder(id, payload) {
		return await http(`/orders/${id}/update-item`, {
			method: 'PUT',
			body: payload
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
	},
	async fetchOrdersHistory(id) {
		return await http(`/orders/history/${id}`);
	}
});
