'use strict';


exports.up = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.text('password').notNullable());
};

exports.down = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.dropColumn('password'));
};
