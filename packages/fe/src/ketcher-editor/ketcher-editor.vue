<script setup>
import { ElPopover, ElButton } from 'element-plus';
import { ref } from 'vue';
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg';
const isPopoverVisible = ref(false);
const ketcherFrame = ref(null);
const smiles = ref(null);

const emit = defineEmits(['export-smiles']);

const searchByStructure = async () => {
	let ketcher = ketcherFrame.value.contentWindow.ketcher;
	try {
		smiles.value = await ketcher.getSmiles();
		emit('export-smiles', smiles.value);
	} catch (e) {
		$notifyUserAboutError(e);
	} finally {
		isPopoverVisible.value = !isPopoverVisible.value;
		ketcher.editor.struct(null);
	}
};
</script>

<template>
	<el-popover v-model:visible="isPopoverVisible" :width="600" :height="600" trigger="click">
		<template #reference>
			<el-button type="primary">Advanced Search</el-button>
		</template>
		<template #default>
			<div class="ketcher-container">
				<div class="ketcher-editor">
					<iframe
						ref="ketcherFrame"
						src="/ketcher/index.html"
						width="100%"
						height="100%"
						frameborder="0"
						allowfullscreen
					></iframe>
				</div>
				<div class="search-btns">
					<el-button type="primary" size="large" plain @click="searchByStructure">
						Search</el-button
					>
					<!-- <el-button type="primary" size="large" plain @click="searchByStructure"
						>Structure</el-button
					>
					<div class="similarity-slider">
						<el-button type="primary" size="large" plain @click="searchBySimilarity"
							>Similarity</el-button
						>
						<el-slider v-model="similarity" />
					</div>
					<el-button type="primary" size="large" plain @click="searchBySubstructure"
						>Substructure</el-button
					> -->
				</div>
			</div>
		</template>
	</el-popover>
</template>

<style scoped>
.ketcher-editor {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1em;
	width: 100%;
	height: 90%;
}

.ketcher-container {
	height: 500px;
}

.search-btns {
	display: flex;
	justify-content: center;
	padding: 0px 20px;
}
</style>
