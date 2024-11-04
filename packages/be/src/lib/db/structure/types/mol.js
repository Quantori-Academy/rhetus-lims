import { customType } from 'drizzle-orm/pg-core';

const mol = customType({
	dataType() {
		return 'mol';
	}
});

export { mol };
