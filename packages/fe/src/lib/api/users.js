import { userInfo } from '../../../spec/mocks/users.js';
import { env } from '../../env.js';

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
		// For some reason, MSW doesn’t start up in time for this request. We need to fix that and remove this workaround.
		if (env.msw.browser) return userInfo.users[0];
		return await http('/me');
	}
});
