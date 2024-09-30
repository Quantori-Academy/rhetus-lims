export default http => ({
	async fetchUsers() {
		return await http(`/users`);
	},
	async addUser(user) {
		return await http('/users/new', {
			method: 'POST',
			body: user
		});
	},
	async fetchUser(id) {
		return await http(`/users/${id}`);
	},
	async updateUser(id, user) {
		return await http(`/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(user)
		});
	},
	async changePassword(id, confirm) {
    return await http(`/users/${id}/change-password`, {
        method: 'POST',
        body: JSON.stringify({ confirm })
    });
}
});
