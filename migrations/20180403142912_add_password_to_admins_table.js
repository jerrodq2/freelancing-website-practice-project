'use strict';


// adds the password field to the admins table, accidentally forgot to add it when I created the first migration
exports.up = (knex) => {
	return knex.schema.alterTable('admins', (table) => table.text('password').notNullable());
};

exports.down = (knex) => {
	return knex.schema.alterTable('admins', (table) => table.dropColumn('password'));
};
