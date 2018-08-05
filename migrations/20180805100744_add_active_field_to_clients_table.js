'use strict';


exports.up = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.boolean('active').notNullable().defaultTo(true));
};

exports.down = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.dropColumn('active'));
};
