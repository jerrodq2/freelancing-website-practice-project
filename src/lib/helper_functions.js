'use strict';


const bcrypt = require('bcrypt'),
	pluralize = require('pluralize');


const hashPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
};

// changes text to plural, ex: book to books
const toPlural = (text) => pluralize.plural(text);
// changes text to singular, ex: books to book
const toSingular = (text) => pluralize.singular(text);

// Used to find the column for a specific constraint in error messages and return said column. Ex: a not null constraint of 'client_id' becomes 'id', or 'clients_email_unique' becomes 'email'
const findColumn = (text) => {
	const str = text.split('_');

	return str[1];
};


module.exports = {
	hashPassword,
	toPlural,
	toSingular,
	findColumn,
};
