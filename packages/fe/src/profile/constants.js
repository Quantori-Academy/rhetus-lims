const requiredRule = { required: true, message: 'Please enter a value', trigger: 'blur' };

export const profileFormRules = {
	firstName: [requiredRule],
	lastName: [requiredRule],
	email: [
		requiredRule,
		{ type: 'email', message: 'Please input correct email address', trigger: 'blur' }
	]
};

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
