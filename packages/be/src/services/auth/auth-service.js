import fp from 'fastify-plugin';

async function authService(server) {
	server.decorate('authService', {
		getCookieSettingsByOrigin: async origin => {
			if (origin === 'http://localhost:5173') {
				return { sameSite: 'lax', secure: false };
			} else if (origin === 'https://vm3.quantori.academy') {
				return { sameSite: 'none', secure: true };
			}
			return {};
		}
	});
}

export default fp(authService);
