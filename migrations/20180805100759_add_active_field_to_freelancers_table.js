'use strict';


exports.up = (knex) => {
	return knex.schema.alterTable('freelancers', (table) => table.boolean('active').notNullable().defaultTo(true));
};

exports.down = (knex) => {
	return knex.schema.alterTable('freelancers', (table) => table.dropColumn('active'));
};
