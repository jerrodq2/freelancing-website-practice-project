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


// Used to find the column for a specific constraint in error messages. There are two possible types of constraints given, I act accordingly for each below
const findColumn = (text) => {
	const str = text.split('_');

	// if the constraint is for a non foreign key columns like a unique username (ex: clients_username_unique), then this will return the field name. 
	if (str.length === 3) return str[1];

	// if the constrain involves a foreign key (ex: clients_field_id_foreign), we grab the field name ('field_id' in this case) and return it
	const result = ''.concat(str[1], '_', str[2]);
	return result;
};


module.exports = {
	hashPassword,
	toPlural,
	toSingular,
	findColumn,
};
