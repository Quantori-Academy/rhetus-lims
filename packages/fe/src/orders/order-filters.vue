<script setup>
import { ElInput, ElDatePicker, ElOption, ElSelect } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { defineModel, onMounted, ref } from 'vue';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { $api } from '../lib/api';

const filters = defineModel('filters', { type: Object });
const statuses = ref([]);
const orders = ref([]);

const setStatuses = async () => {
	try {
		const data = await $api.orders.fetchOrders();
		orders.value = data.orders;
		const uniqueStatuses = [...new Set(orders.value.map(room => room.status))];
		statuses.value = uniqueStatuses.map(status => ({
			value: status,
			label: status
		}));
	} catch (error) {
		$notifyUserAboutError(error);
	}
};
onMounted(() => {
	setStatuses();
});
</script>

<template>
	<div>
		<filter-item>
			<el-input v-model="filters.title" clearable placeholder="Enter title">
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-input>
		</filter-item>
		<filter-item>
			<el-select v-model="filters.status" filterable clearable placeholder="Enter status">
				<el-option
					v-for="status of statuses"
					:key="status.value"
					:label="status.label"
					:value="status.value"
				/>
				<template #prefix>
					<rh-icon name="search" />
				</template>
			</el-select>
		</filter-item>
	</div>
	<div>
		<filter-item>
			<el-date-picker
				v-model="filters.createdAt"
				type="daterange"
				range-separator="-"
				start-placeholder="Created from"
				end-placeholder="to"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			/>
		</filter-item>
		<filter-item>
			<el-date-picker
				v-model="filters.updatedAt"
				type="daterange"
				range-separator="-"
				start-placeholder="Updated from"
				end-placeholder="to"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			/>
		</filter-item>
	</div>
</template>
