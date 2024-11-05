<script setup>
import { onMounted, ref } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import RhIcon from '../lib/components/rh-icon.vue';
import FilterItem from '../lib/components/rh-filters/filter-item.vue';
import { defineModel } from 'vue';
import { debounce } from '../lib/utils/debounce/debounce';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
import { $api } from '../lib/api';

const filters = defineModel('filters', { type: Object });
const rooms = ref([]);
const names = ref([]);
const objectNames = ref([]);
const objectRooms = ref([]);

const setNames = debounce(async () => {
	try {
		const data = await $api.storages.fetchStoragesNames();
		names.value = data.names;
		objectNames.value = names.value.map(name => ({
			value: name,
			label: name
		}));
	} catch (error) {
		$notifyUserAboutError(error);
	}
}, 200);

const setRooms = debounce(async () => {
	try {
		const data = await $api.storages.fetchStoragesRooms();
		rooms.value = data.rooms;
		objectRooms.value = rooms.value.map(room => ({
			value: room,
			label: room
		}));
	} catch (error) {
		$notifyUserAboutError(error);
	}
}, 200);

onMounted(() => {
	setNames();
	setRooms();
});
</script>

<template>
	<filter-item>
		<el-select v-model="filters.room" filterable clearable placeholder="Enter room">
			<el-option
				v-for="room of objectRooms"
				:key="room.value"
				:label="room.label"
				:value="room.value"
			/>
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-select>
	</filter-item>

	<filter-item>
		<el-select v-model="filters.name" filterable clearable placeholder="Enter name">
			<el-option
				v-for="name of objectNames"
				:key="name.value"
				:label="name.label"
				:value="name.value"
			/>
			<template #prefix>
				<rh-icon name="search" />
			</template>
		</el-select>
	</filter-item>
</template>
