export const formRules = {
	room: [
		{ required: true, message: "Room can't be empty" },
		{ max: 300, message: "Room can't exceed 300 characters" }
	],
	name: [
		{ required: true, message: "Name can't be empty" },
		{ max: 300, message: "Name can't exceed 300 characters" }
	]
};

export const emptyStorage = {
	name: '',
	room: '',
	description: ''
}