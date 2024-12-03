export default http => ({
	async fetchNotifications(params) {
		return await http(`/notifications`, { query: params });
	}
});
