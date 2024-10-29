import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

export const authHandlers = [
	http.post(api('/login'), () => {
		return HttpResponse.json({});
	}),
	http.post(api('/request-password-reset'), async ({ request }) => {
		const body = await request.json();
		return HttpResponse.json({
			status: 'success',
			message: `Password reset request sent for ${body.username}`
		});
	}),
	http.patch(api('/set-temporary-password/:id'), () => {
		return HttpResponse.json({
			status: 'success',
			message: `Password changed`
		});
	}),
	http.patch(api('/reset-password'), () => {
		return HttpResponse.json({
			status: 'success',
			message: `Password successfully reset`
		});
	})
];
