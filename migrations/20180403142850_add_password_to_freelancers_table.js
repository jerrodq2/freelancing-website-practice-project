'use strict';


// adds the password field to the freelancers table, accidentally forgot to add it when I created the first migration
exports.up = (knex) => {
	return knex.schema.alterTable('freelancers', (table) => table.text('password').notNullable());
};

exports.down = (knex) => {
	return knex.schema.alterTable('freelancers', (table) => table.dropColumn('password'));
};
