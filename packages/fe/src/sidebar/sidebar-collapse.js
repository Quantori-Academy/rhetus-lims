const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

export function getSidebarCollapsedState() {
	return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
}

export function toggleSidebarCollapse() {
	const isCollapsed = getSidebarCollapsedState();
	localStorage.setItem(SIDEBAR_COLLAPSED_KEY, isCollapsed ? 'false' : 'true');
}
