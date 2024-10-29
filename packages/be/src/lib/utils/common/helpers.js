import bcrypt from 'bcrypt';
import { trimValue } from './trim-value.js';

const BCRYPT_SALT = 10;

const helpers = {
	lowercase: string => string.toLowerCase(),
	capitalize: string => `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`,
	toDate: string => new Date(string),
	hash: string => bcrypt.hashSync(string, BCRYPT_SALT),
	trim: value => trimValue(value)
};

export { helpers };
