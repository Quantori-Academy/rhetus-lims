export default http => ({
	async login(payload) {
		return await http('/login', {
			method: 'POST',
			body: payload
		});
	},
	async requestPasswordReset(username) {
		return await http('/request-password-reset', {
			method: 'PATCH',
			body: username
		});
	},
	async setTemporaryPassword(id, password) {
		return await http(`/set-temporary-password/${id}`, {
			method: 'PATCH',
			body: password
		});
	},
	async resetPassword(password) {
		return await http('/reset-password', {
			method: 'PATCH',
			body: password
		});
	}
});
