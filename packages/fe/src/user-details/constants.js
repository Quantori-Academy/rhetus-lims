import { __ } from '../lib/locales';
export const formRules = {
	firstName: [{ required: true, message: __("First name can't be empty") }],
	lastName: [{ required: true, message: __("Last name can't be empty"), trigger: 'change' }],
	email: [
		{ required: true, message: __("Email can't be empty") },
		{ type: 'email', message: __('Please input a valid email address'), trigger: 'blur' }
	]
};

const requiredRule = { required: true, message: __('Please enter a value'), trigger: 'blur' };

export const passwordFormRules = passwords => ({
	password: [
		requiredRule,
		{
			min: 8,
			message: __('Password must be at least 8 characters long'),
			trigger: ['blur', 'change']
		}
	],
	confirmPassword: [
		requiredRule,
		{
			validator: (_, value) => value === passwords.value.password,
			message: __('Passwords must match'),
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
