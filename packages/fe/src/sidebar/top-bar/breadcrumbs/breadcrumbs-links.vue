<template>
	<div class="breadcrumb-links-container">
		<slot name="before" />

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
</template>
