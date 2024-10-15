import { http, HttpResponse } from 'msw';
import { api } from './api-url.js';

export const authHandlers = [
	http.post(api('/login'), () => {
		return HttpResponse.json({});
	}),
	http.post(api('/request-password-reset'), () => {
		return HttpResponse.json({});
	})
];
