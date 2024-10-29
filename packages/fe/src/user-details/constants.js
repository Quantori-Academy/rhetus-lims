export const formRules = {
	firstName: [{ required: true, message: "First name can't be empty" }],
	lastName: [{ required: true, message: "Last name can't be empty", trigger: 'change' }],
	email: [
		{ required: true, message: "Email can't be empty" },
		{ type: 'email', message: 'Please input a valid email address', trigger: 'blur' }
	]
};

const requiredRule = { required: true, message: 'Please enter a value', trigger: 'blur' };

export const passwordFormRules = passwords => ({
	password: [requiredRule],
	confirmPassword: [
		requiredRule,
		{
			validator: (_, value) => value === passwords.value.password,
			message: 'Passwords must match',
			trigger: ['blur', 'change']
		}
	]
});

export const emptyUser = {
	id: null,
	username: '',
	firstName: '',
	lastName: '',
	email: '',
	role: {
		id: null,
		name: ''
	},
	createdAt: ''
};
