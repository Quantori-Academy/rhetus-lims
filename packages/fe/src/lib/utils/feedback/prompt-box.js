import { ElMessageBox } from 'element-plus';

export const $promptInputBox = async (options = {}) => {
	return await ElMessageBox.prompt(`${options.message}`, 'Warning', {
		confirmButtonText: options.confirm || 'Ok',
		cancelButtonText: options.cancel || 'Cancel',
		inputPattern: options.pattern || /\S+/,
		inputErrorMessage: options.error || 'Input is required'
	});
};
