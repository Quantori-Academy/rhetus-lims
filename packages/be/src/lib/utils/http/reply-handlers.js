function handleError(reply, statusCode, message) {
	reply.code(statusCode);
	return { status: 'error', message };
}

function handleSuccess(reply, statusCode, message, data = {}) {
	reply.code(statusCode);
	return { status: 'success', message, ...data };
}

export { handleError, handleSuccess };
