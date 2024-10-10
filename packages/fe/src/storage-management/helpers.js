import { ref } from 'vue';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';

export const rules = ref({
	room: [
		{ required: true, message: "Room can't be empty" },
		{ max: 30, message: 'Room cannot exceed 30 characters' }
	],
	name: [
		{ required: true, message: "Name can't be empty" },
		{ max: 30, message: 'Name cannot exceed 30 characters' }
	]
});

export const validate = async formEl => {
	try {
		const isValid = await formEl.value.validate();
		return isValid;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error submitting form');
		return false;
	}
};
