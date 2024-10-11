export const formRules = {
	firstName: [{ required: true, message: "First name can't be empty" }],
	lastName: [{ required: true, message: "Last name can't be empty", trigger: 'change' }],
	email: [
		{ required: true, message: "Email can't be empty" },
		{ type: 'email', message: 'Please input a valid email address', trigger: 'blur' }
	]
};
