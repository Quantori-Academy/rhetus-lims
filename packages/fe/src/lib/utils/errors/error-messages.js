export const $error = (statusCode, message) => {
	switch (statusCode) {
		case 400:
			return `Bad Request: ${message}`;
		case 401:
			return 'Unauthorized user, please login';
		case 403:
			return 'Forbidden: Access denied.';
		case 404:
			return 'Not Found: Resource does not exist.';
		case 500:
			return 'Server Error: Please try again later.';
		default:
			return 'An unknown error occurred.';
	}
};
