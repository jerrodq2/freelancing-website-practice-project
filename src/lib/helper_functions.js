'use strict';


// This file contains helper functions that can be used throughout the password for a variety of reasons.
const bcrypt = require('bcrypt'),
	pluralize = require('pluralize');


const hashPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

// changes text to plural, ex: book to books
const toPlural = (text) => pluralize.plural(text);
// changes text to singular, ex: books to book
const toSingular = (text) => pluralize.singular(text);


// Used to find the column for a specific constraint in error messages. We take out the table name and type of constraint within the given string and return only the field, ex: jobs_client_id_foreign becomes 'client_id' or admin_username_unique becomes 'username'
const findColumn = (text, table) => {
	// starting str example: 'admin_username_unique'
	let str = text;
	str = str.replace(`${table}_`, ''); // becomes 'username_unique'
	str = str.replace('_unique', ''); // becomes 'username'
	str = str.replace('_foreign', '');
	return str;
};


module.exports = {
	hashPassword,
	toPlural,
	toSingular,
	findColumn,
};
