'use strict';


exports.up = (knex) => {
	return knex.schema.alterTable('admins', (table) => table.text('password').notNullable());
};

exports.down = (knex) => {
	return knex.schema.alterTable('admins', (table) => table.dropColumn('password'));
};
