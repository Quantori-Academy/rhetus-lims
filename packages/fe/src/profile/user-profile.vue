<script setup>
import { onMounted, ref, useTemplateRef, computed } from 'vue';
import { $api } from '../lib/api';
import { ElForm, ElFormItem, ElInput, ElButton, ElDivider, ElSelect, ElOption } from 'element-plus';
import { $notifyUserAboutError, $notify } from '../lib/utils/feedback/notify-msg';
import { $confirm } from '../lib/utils/feedback/confirm-msg';
import { $isFormValid } from '../lib/utils/form-validation/is-form-valid';
import { passwordFormRules, profileFormRules } from './constants';
import { $route, $router } from '../lib/router/router';
import { locales } from '../lib/locales/locales';
import { __, languageCode } from '../lib/locales';
import { setLocale } from '../lib/locales/set-locale.js';

const editable = computed(() => $route.value.name === 'edit-user-profile');
const profile = ref(null);
const form = useTemplateRef('form');
const language = ref(languageCode());
const resetPassForm = useTemplateRef('reset-pass-form');
const passwords = ref({ password: '', confirmPassword: '' });

const profileRules = ref(profileFormRules);
const passwordRules = ref(passwordFormRules(passwords));

const setProfile = async () => {
	try {
		profile.value = await $api.users.fetchCurrentUserInfo();
	} catch (err) {
		$notifyUserAboutError(err);
	}
};

const toggleEdit = async () => {
	if (editable.value) {
		resetPassForm.value.resetFields();
		setProfile();
	}
	$router.push({
		name: editable.value ? 'user-profile' : 'edit-user-profile'
	});
};

const editHandler = async () => {
	if (!(await $isFormValid(form))) return;
	try {
		await $api.users.updateUser(profile.value.id, profile.value);
		editable.value = false;
		$notify({
			title: 'Success',
			message: 'Profile updated',
			type: 'success'
		});
		resetPassForm.value.resetFields();
		$router.push({ name: 'user-profile' });
	} catch (err) {
		$notifyUserAboutError(err);
	}
};

const passwordChangeHandler = async () => {
	if (!(await $isFormValid(resetPassForm))) return;

	try {
		await $confirm('Are you sure you want to reset your password?', 'Change password?', {
			type: 'warning'
		});
		const res = await $api.auth.resetPassword({
			password: passwords.value.password
		});
		$notify({
			title: 'Success',
			message: res.message,
			type: 'success'
		});
		resetPassForm.value.resetFields();
		$router.push({ name: 'user-profile' });
	} catch (error) {
		if (!['cancel', 'close'].includes(error)) {
			this.$notifyUserAboutError(error);
		}
	}
};
const langChangeHandler = async () => {
	try {
		setLocale(language.value);
		await $router.push({ name: 'user-profile' });
		location.reload();
	} catch (error) {
		$notifyUserAboutError(error);
	}
};

onMounted(() => {
	setProfile();
});
</script>

<template>
	<div class="wrapper">
		<div class="editing-header">
			{{ __('My Profile') }}
			<el-button :type="editable ? 'default' : 'primary'" @click="toggleEdit">{{
				editable ? __('Cancel') : __('Edit')
			}}</el-button>
		</div>
		<el-form
			v-if="profile"
			ref="form"
			:model="profile"
			label-position="top"
			:rules="profileRules"
			@submit="editHandler"
		>
			<el-form-item :label="__('Username')" prop="username">
				<el-input v-model="profile.username" :disabled="true" />
			</el-form-item>
			<el-form-item :label="__('First name')" prop="firstName">
				<el-input v-model="profile.firstName" :disabled="!editable" />
			</el-form-item>
			<el-form-item :label="__('Last name')" prop="lastName">
				<el-input v-model="profile.lastName" :disabled="!editable" />
			</el-form-item>
			<el-form-item :label="__('Email')" prop="email">
				<el-input v-model="profile.email" :disabled="!editable" />
			</el-form-item>
			<el-form-item :label="__('Role')" prop="role">
				<el-input v-model="profile.role.name" :disabled="true" />
			</el-form-item>
			<div v-if="editable" class="btn-container">
				<el-button v-if="editable" type="primary" @click="editHandler">
					{{ __('Update') }}
				</el-button>
			</div>
		</el-form>
	</div>
	<div class="wrapper">
		<div class="section-header">{{ __('Reset password') }}</div>
		<el-form
			ref="reset-pass-form"
			:model="passwords"
			label-position="top"
			:rules="passwordRules"
			@submit="passwordChangeHandler"
		>
			<el-form-item :label="__('New password')" prop="password">
				<el-input
					v-model="passwords.password"
					:disabled="!editable"
					:placeholder="__('Input password')"
					type="password"
					show-password
				/>
			</el-form-item>
			<el-form-item :label="__('Confirm password')" prop="confirmPassword">
				<el-input
					v-model="passwords.confirmPassword"
					:disabled="!editable"
					:placeholder="__('Confirm password')"
					type="password"
					show-password
				/>
			</el-form-item>
			<div v-if="editable" class="btn-container">
				<el-button type="primary" @click="passwordChangeHandler">
					{{ __('Reset password') }}
				</el-button>
			</div>
		</el-form>
	</div>
	<div class="wrapper">
		<el-divider />
		<div class="section-header">
			{{ __('Localization') }}
			<p>{{ __('Customize language settings') }}</p>
		</div>
		<el-form label-position="top">
			<el-form-item :label="__('Language')">
				<el-select v-model="language" :disabled="!editable">
					<el-option
						v-for="lang of locales"
						:key="lang.value"
						:label="lang.label"
						:value="lang.value"
					/>
				</el-select>
			</el-form-item>
			<div v-if="editable" class="btn-container">
				<el-button type="primary" @click="langChangeHandler">{{ __('Save') }}</el-button>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.section-header {
	margin-bottom: 12px;
	font-weight: 500;
	font-size: large;

	p {
		margin-top: 6px;
		color: var(--rh-color-info-700);
		font-size: 14px;
	}
}
@media (max-width: 520px) {
	.form-container {
		width: 220px;
	}
}
</style>
