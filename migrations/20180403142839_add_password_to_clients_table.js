'use strict';


// adds the password field to the clients table, accidentally forgot to add it when I created the first migration
exports.up = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.text('password').notNullable());
};

exports.down = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.dropColumn('password'));
};
