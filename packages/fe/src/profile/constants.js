const requiredRule = { required: true, message: 'Please enter a value', trigger: 'blur' };

export const profileFormRules = {
	email: [
		requiredRule,
		{ type: 'email', message: 'Please input correct email address', trigger: 'blur' }
	]
};

export const passwordFormRules = passwords => ({
	password: [
		requiredRule,
		{ min: 8, message: 'Password must be at least 8 characters long', trigger: ['blur', 'change'] }
	],
	confirmPassword: [
		requiredRule,
		{
			validator: (_, value) => value === passwords.value.password,
			message: 'Passwords must match',
			trigger: ['blur', 'change']
		}
	]
});

export const emptyProfile = {
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
