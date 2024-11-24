/**
 * Very limited implementation of sprintf supporting only named parameters.
 * @param {string} input - (translated) text with parameters (e.g. '%{num_users} users use us')
 * @param {Object.<string, string|number>} [parameters] - object mapping parameter names to values (e.g. { num_users: 5 })
 * @returns {string} the text with parameters replaces (e.g. '5 users use us')
 */
export default function sprintf(input, parameters) {
	let output = input;

	output = output.replace(/%+/g, '%');

	if (parameters) {
		const mappedParameters = new Map(Object.entries(parameters));

		mappedParameters.forEach((key, parameterName) => {
			const parameterValue = mappedParameters.get(parameterName);
			// Pass the param value as a function to ignore special replacement patterns like $` and $'.
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#syntax
			output = output.replace(new RegExp(`%{${parameterName}}`, 'g'), () => parameterValue);
		});
	}

	return output;
}
