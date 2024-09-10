<script setup>
import { ElForm, ElInput, ElSelect, ElOption, ElButton, ElFormItem, ElSwitch } from 'element-plus';
import RhIcon from '~/lib/components/rh-icon.vue';
import { ref } from 'vue';

function createDefaultFormValues() {
	return {
		name: 'default value',
		region: '',
		delivery: false
	};
}

const form = ref(createDefaultFormValues());

function onSubmit() {
	console.log('submit');
	form.value = createDefaultFormValues();
}
</script>

<template>
	<div class="wrapper">
		<el-form :model="form" label-width="auto">
			<el-form-item label="Activity name">
				<el-input v-model="form.name" />
			</el-form-item>
			<el-form-item label="Activity zone">
				<el-select v-model="form.region" placeholder="please select your zone">
					<el-option label="Zone one" value="shanghai" />
					<el-option label="Zone two" value="beijing" />
				</el-select>
			</el-form-item>
			<el-form-item label="Instant delivery"> <el-switch v-model="form.delivery" /> </el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">
					<slot name="icon">
						<div class="icon-container">
							<rh-icon color="white" size="16" name="dollar" />
						</div>
					</slot>
					Create
				</el-button>
				<el-button>Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	place-content: center;
	gap: 24px;
}

.icon {
	color: white;
}

.icon-container {
	margin-right: 4px;
}
</style>
