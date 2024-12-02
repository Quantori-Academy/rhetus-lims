<script setup>
import { toRef } from 'vue';
import { ElFormItem, ElTable, ElTableColumn } from 'element-plus';
import RhIcon from '../../../lib/components/rh-icon.vue';
import { $router } from '../../../lib/router/router';
import { __ } from '../../../lib/locales';

const props = defineProps({
	data: { type: Object, default: null }
});
const data = toRef(props, 'data');
function redirect(row) {
	$router.push({
		name: row.category.toLowerCase() === 'reagent' ? 'reagent-details' : 'sample-details',
		params: { id: row.id }
	});
}
</script>

<template>
	<el-form-item :label="__('Substances used')" prop="components">
		<el-table :data="data" :border="true" @row-click="redirect">
			<el-table-column prop="name" :label="__('Name')" />
			<el-table-column prop="category" :label="__('Category')">
				<template #default="{ row }">
					<div class="category-icons">
						<rh-icon
							color="#8892A8"
							:name="row.category.toLowerCase() === 'reagent' ? 'pod' : 'applications'"
						/>
						<span>{{ __(row.category) }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="quantityUsed" :label="__('Quantiy Used')" />
		</el-table>
	</el-form-item>
</template>
