const requiredRule = { required: true, message: 'Please enter a value', trigger: 'blur' };

export const profileFormRules = {
	firstName: [
		requiredRule,
		{ min: 3, message: 'Name must be at least 3 characters long', trigger: ['blur', 'change'] }
	],
	lastName: [
		requiredRule,
		{ min: 3, message: 'Last name must be at least 3 characters long', trigger: ['blur', 'change'] }
	],
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

export const languages = [
	{
		value: 'en',
		label: 'English'
	},
	{
		value: 'ka',
		label: 'Georgian'
	},
	{
		value: 'hy',
		label: 'Armenian'
	},
	{
		value: 'kk',
		label: 'Kazakh'
	},
	{
		value: 'uk',
		label: 'Ukrainian'
	}
];
