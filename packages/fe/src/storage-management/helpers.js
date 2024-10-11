import { ref } from 'vue';

export const rules = ref({
	room: [
		{ required: true, message: "Room can't be empty" },
		{ max: 300, message: 'Room cannot exceed 300 characters' }
	],
	name: [
		{ required: true, message: "Name can't be empty" },
		{ max: 300, message: 'Name cannot exceed 300 characters' }
	]
});
