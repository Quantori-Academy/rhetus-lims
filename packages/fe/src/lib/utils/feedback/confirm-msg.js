import { ElMessageBox } from 'element-plus';

export const $confirm = (message, title, options = {}) => {
	return new Promise((resolve, reject) => {
		ElMessageBox.confirm(message, title, {
			distinguishCancelAndClose: true,
			confirmButtonText: options.confirmButtonText || 'OK',
			cancelButtonText: options.cancelButtonText || 'Cancel',
			type: options.type || 'warning', // types ('info', 'success', 'warning')
			...options
		})
			.then(resolve)
			.catch(reject);
	});
};
