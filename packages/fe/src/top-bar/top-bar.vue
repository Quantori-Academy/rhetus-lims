<script setup>
import SidebarButton from '../sidebar/sidebar-button.vue';
</script>

<template>
	<div class="top-bar-fixed">
		<div class="top-bar-container">
			<div class="breadcrumb-links-container">
				<sidebar-button v-if="false" />

				<div class="breadcrumb-links">
					<nav>
						<ol>
							<li>Home</li>
							<li class="current-page">
								{{ $route.name }}
							</li>
						</ol>
					</nav>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
.top-bar-fixed {
	position: fixed;
	top: 0;
	right: 200px;
	left: var(--sidebar-width);

	z-index: 10;
	padding: 0 24px;
	width: 100%;

	border-bottom: 1px solid var(--border-color);
	background-color: white;

	transition-property: width, left, right;
	transition-duration: 200ms;
	transition-timing-function: ease;
}

.top-bar-container {
	display: flex;
	align-items: center;

	gap: 2px;
	width: 100%;
	min-height: 48px;
}

.breadcrumb-links-container {
	display: flex;
	flex-grow: 1;
	flex-basis: 0;
	justify-items: start;
	align-items: center;
}

.breadcrumb-links {
	ol {
		padding: 0;
	}

	li {
		display: inline;
		list-style: none;

		&::after {
			content: '/';
			padding-right: 4px;
			padding-left: 4px;
		}
	}

	.current-page::after {
		content: '';
	}
}
</style>
