<script setup>
import { defineModel, onMounted, ref } from 'vue';
import { ElDatePicker, ElSelect, ElOption } from 'element-plus';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg.js';
import { $api } from '../lib/api/index.js';

const roles = ref([]);
const isLoading = ref(true);
const filters = defineModel('filters', { type: Object });

async function setRoles() {
	isLoading.value = true;
	try {
		roles.value = await $api.users.getRoles();
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		isLoading.value = false;
	}
}

onMounted(() => {
	setRoles();
});
</script>

<template>
	<filter-item>
		<el-select v-model="filters.role" :loading="isLoading" placeholder="Select role" clearable>
			<el-option v-for="role of roles" :key="role.id" :label="role.name" :value="role.name" />
		</el-select>
	</filter-item>
	<filter-item>
		<el-date-picker
			v-model="filters.lastLogin"
			type="daterange"
			range-separator="-"
			start-placeholder="Logged in from"
			end-placeholder="to"
			format="YYYY/MM/DD"
			value-format="YYYY-MM-DD"
		/>
	</filter-item>
</template>
