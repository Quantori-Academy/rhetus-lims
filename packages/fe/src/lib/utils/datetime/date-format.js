import { format } from 'date-fns';

// We show all dates in this format
const DEFAULT_FORMAT = 'dd-MMM-yyyy';

export const toDefaultFormat = (date) => format(date, DEFAULT_FORMAT);

export const formatDate = (date) => {
	if (!date) return '';

	return toDefaultFormat(new Date(date)).toUpperCase();
};
