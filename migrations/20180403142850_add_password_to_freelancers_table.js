'use strict';


exports.up = (knex) => {
	return knex.schema.alterTable('freelancers', (table) => table.text('password').notNullable());
};

exports.down = (knex) => {
	return knex.schema.alterTable('freelancers', (table) => table.dropColumn('password'));
};
