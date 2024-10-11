import { ref } from 'vue';

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

