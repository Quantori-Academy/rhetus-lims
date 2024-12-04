<script setup>
import { ElTable, ElTableColumn, ElSelect, ElOption, ElButton, ElForm, ElTag } from 'element-plus';
import { $notifyUserAboutError } from '../../lib/utils/feedback/notify-msg';
import { computed, onMounted, ref } from 'vue';
import { $api } from '../../lib/api/index.js';
import RhIcon from '../../lib/components/rh-icon.vue';
import { $router } from '../../lib/router/router.js';

const props = defineProps({
	id: {
		type: String,
		default: null
		// default: '19ef336f-494c-4ed6-ae52-4830752a472e' // use this for testing
	}
});
const storageAssignments = ref([]);
const order = ref(null);
const storages = ref([]);
const fulfilledReagents = ref([]);
const loading = ref(false);
const saveDisabled = computed(() => {
	return !fulfilledReagents.value.every(item => item.selectedStorage);
});

onMounted(() => {
	setOrder(props.id);
	setSubstances();
	setStorages();
});

const setOrder = async id => {
	loading.value = true;
	try {
		const response = await $api.orders.fetchOrder(id);
		order.value = response;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storages');
	} finally {
		loading.value = false;
	}
};

const setSubstances = async () => {
	loading.value = true;
	try {
		const params = {
			limiit: 200,
			options: {
				order: props.id,
				category: 'reagent'
			}
		};
		const response = await $api.substances.fetchSubstances(params);
		const filteredSubstances = response.substances.filter(
			substance => substance.orderId === props.id
		);
		fulfilledReagents.value = filteredSubstances;
	} catch (error) {
		$notifyUserAboutError(error.message || 'Error updating storages');
	} finally {
		loading.value = false;
	}
};
async function setStorages() {
	loading.value = true;
	try {
		const data = await $api.storages.fetchStorages();
		storages.value = data;
	} catch (error) {
		$notifyUserAboutError(error);
	} finally {
		loading.value = false;
	}
}

const saveChanges = async () => {
	try {
		const body = {
			action: 'next',
			reagents: storageAssignments.value
		};

		const res = await $api.orders.changeOrderStatus(props.id, body);
		if (res.status === 'success') {
			$router.push({ name: 'order-details', params: { id: props.id } });
		}
	} catch (error) {
		$notifyUserAboutError(error.message || 'Failed to update order status');
	}
};

const handleStorageChange = (row, index, storageId) => {
	storageAssignments.value.push({
		id: row.id,
		storageId: storageId
	});
	fulfilledReagents.value[index].selectedStorage = storages.value.find(
		storage => storage.id === storageId
	);
};

const isStorageAssigned = row => {
	return storageAssignments.value.find(item => item.id === row.id && row.selectedStorage);
};
const cancelChanges = () => {
	$router.push({ name: 'order-details', params: { id: order.value.id } });
};
</script>

<template>
	<div v-if="fulfilledReagents && order" v-loading="loading" class="wrapper">
		<h2>Move substances to storages - {{ order?.title }}</h2>
		<el-form ref="form-ref" :model="fulfilledReagents">
			<el-table :data="fulfilledReagents">
				<el-table-column width="50">
					<template #default="{ row }">
						<rh-icon
							color="#1785be"
							:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
						/>
					</template>
				</el-table-column>
				<el-table-column label="Name" prop="name" />
				<el-table-column label="Quantity" prop="quantity" width="100" />
				<el-table-column label="Quantity Unit" prop="quantityUnit" width="150" />
				<el-table-column label="Storage Location" width="200">
					<template #default="{ row, $index }">
						<el-select
							v-model="row.selectedStorage"
							:loading="loading"
							filterable
							clearable
							placeholder="Select storage"
							@change="value => handleStorageChange(row, $index, value)"
						>
							<el-option
								v-for="storage of storages"
								:key="storage.id"
								:label="`${storage.room} - ${storage.name}`"
								:value="storage.id"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column width="50">
					<template #default="{ row }">
						<el-tag size="default" circle :type="isStorageAssigned(row) ? `success` : `danger`">
							<rh-icon color="white" :name="isStorageAssigned(row) ? `check` : `warning`"
						/></el-tag>
					</template>
				</el-table-column>
			</el-table>
			<div class="btn-container">
				<el-button @click="cancelChanges">Cancel</el-button>
				<el-button type="primary" :disabled="saveDisabled" @click="saveChanges"
					>Save Changes</el-button
				>
			</div>
		</el-form>
	</div>
</template>

<style scoped>
.wrapper,
.el-form {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}
</style>
