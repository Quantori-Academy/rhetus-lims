<template>
	<div class="action-buttons">
		<slot name="action-buttons" />
	</div>

	<div class="filter">
		<slot name="filters" />
	</div>

	<div class="after-buttons">
		<slot name="after-buttons" />
	</div>
</template>

<style>
.action-buttons {
	display: flex;
	justify-content: end;
	align-items: center;
	margin: 20px 0;
}

.filter {
	display: flex;
	flex-wrap: wrap;
	justify-content: start;
	padding: 5px 0;
}

.after-buttons {
	display: flex;
	justify-content: end;
}
</style>
