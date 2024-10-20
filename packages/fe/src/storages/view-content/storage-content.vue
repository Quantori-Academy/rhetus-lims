<script setup>
import { onMounted, ref } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $api } from '../../lib/api/index';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';

const props = defineProps({
	id: {
		type: String,
		default: null
	}
});

const substances = ref(null);
const loading = ref(false);

async function setSubstances(id) {
	loading.value = true;
	try {
		const data = await $api.substances.fetchSubstances(id);
		substances.value = data;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating reagent');
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	setSubstances(props.id);
});
</script>

<template>
	<div>
		<el-table v-loading="isLoading" :data="substances" @row-click="viewReagent">
			<el-table-column prop="name" label="Name" sortable />
			<el-table-column prop="category" label="Category" sortable />
			<el-table-column prop="structure" label="Structure" />
			<el-table-column prop="description" label="Description" />
			<el-table-column prop="quantityLeft" label="Quantity Left" />
			<el-table-column>
				<template #default="{ row }">
					<el-button @click="() => editReagent(row.id)"><rh-icon name="pencil" /></el-button>
					<el-button type="danger" @click="() => deleteReagent(row.id)">
						<rh-icon color="white" name="trash" />
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
