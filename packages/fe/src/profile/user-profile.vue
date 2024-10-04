<script setup>
import {onMounted, ref} from 'vue';
import { $api } from '../lib/api';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';

const editable = ref(false);
const profile = ref(null);

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});
const setProfile = async id => {
	try {
		const data = await $api.users.fetchUser(id);
		profile.value = data;
	} catch(err) {
		$notifyUserAboutError(err.message)
	}
};
const onProfileEdit = () => {
	editable.value = !editable.value
};
onMounted(() => {
	setProfile(props.id)
});

</script>

<template>
	<div class="profile">
		<h1>Profile</h1>
		<el-form v-if="profile" class="el-form" :model="profile" label-position="top" >
			<el-form-item label="Username" prop="username">
				<el-input v-model="profile.username" readonly=true :disabled="editable" />
			</el-form-item>
			<el-form-item label="First name" prop="firstName">
				<el-input v-model="profile.firstName" :readonly=!editable />
			</el-form-item>
			<el-form-item label="Last name" prop="lastName">
				<el-input v-model="profile.lastName" :readonly=!editable />
			</el-form-item>
			<el-form-item label="Email" prop="email">
				<el-input v-model="profile.email" :readonly=!editable />
			</el-form-item>
			<!-- <el-form-item label="Password">
				<el-input type="password" :readonly=!editable />
			</el-form-item> -->
			<el-form-item label="Role" prop="role">
				<el-input v-model="profile.role" readonly=true :disabled=editable />
			</el-form-item>

			<el-form-item>
				<el-button :type="editable ? 'default' : 'primary'" @click="onProfileEdit">{{ editable ? 'Cancel' : 'Edit' }}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.profile {
	margin: 0 15px;

	h1 {
		color: #080808;
		margin-bottom: 1rem;
	}
}

.el-form {
	width: 400px;
}

@media (max-width: 520px) {
	.el-form {
		width: 220px;
	}
}

</style>
