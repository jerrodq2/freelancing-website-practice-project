'use strict';


// Adds an active field to the clients table. This is a boolean that takes the place of delete, allowing clients to be marked as inactive, thus not showing up in any searches, or allowing them to create any jobs, while also still remaining in the database and not having to be deleted
exports.up = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.boolean('active').notNullable().defaultTo(true));
};

exports.down = (knex) => {
	return knex.schema.alterTable('clients', (table) => table.dropColumn('active'));
};
