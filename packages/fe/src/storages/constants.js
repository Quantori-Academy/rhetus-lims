import { __ } from '../lib/locales';

export const formRules = (storage, uniqueRoomsNames) => ({
	room: [
		{ required: true, message: __("Room can't be empty") },
		{ max: 300, message: __("Room can't exceed 300 characters") }
	],
	name: [
		{ required: true, message: __("Name can't be empty") },
		{ max: 300, message: __("Name can't exceed 300 characters") },
		{
			validator: (_, value) =>
				!(
					value.trim() !== '' &&
					storage.value.room.trim() !== '' &&
					uniqueRoomsNames.value.some(x => x.room === storage.value.room && x.name === value)
				),
			message: __('Storage location with this room and name already exists'),
			trigger: ['blur', 'change']
		}
	]
});

export const emptyStorage = {
	name: '',
	room: '',
	description: ''
};
