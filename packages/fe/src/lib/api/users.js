export default http => ({
	async getRoles() {
		return await http('/roles');
	},
	async fetchUsers() {
		return await http(`/users`);
	},
	async addUser(user) {
		return await http('/users', {
			method: 'POST',
			body: user
		});
	},
	async fetchUser(id) {
		return await http(`/users/${id}`);
	},
	async updateUser(id, user) {
		return await http(`/users/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(user)
		});
	},
	async changePassword(id, confirm) {
		return await http(`/users/${id}/change-password`, {
			method: 'POST',
			body: JSON.stringify({ confirm })
		});
	},
	async deleteUser(id) {
		return await http(`/users/${id}`, {
			method: 'DELETE'
		});
	},
	async fetchCurrentUserInfo() {
		return await http('/me');
	}
});
