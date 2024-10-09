import { $notifyUserAboutError } from '../feedback/notify-msg';

export async function $isFormValid(formEl) {
	try {
		return await formEl.value.validate();
	} catch {
		$notifyUserAboutError('Error submitting form');
		return false;
	}
}
