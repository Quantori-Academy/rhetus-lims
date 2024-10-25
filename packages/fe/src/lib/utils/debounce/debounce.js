export const debounce = (func, delay, { leading } = {}) => {
	let timerId;
	let shouldInvoke;

	return (...args) => {
		shouldInvoke = true;

		if (!timerId && leading) {
			func(...args);
			shouldInvoke = false;
		}
		clearTimeout(timerId);

		timerId = setTimeout(() => shouldInvoke && func(...args), delay);
	};
};
