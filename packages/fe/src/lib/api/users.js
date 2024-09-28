export default http => ({
	async fetchUsers() {
		return await http(`/users`);
	},
	async addUser(user) {
		return await http('/users/new', {
			method: 'POST',
			body: user
		});
	}
});
