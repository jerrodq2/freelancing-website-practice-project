'use strict';


// creates the flagged_clients table. This is for clients who have been flagged as inappropriate. It also saves the client or freelancer who created the flag or who flagged the client in question.
exports.up = (knex) => knex.schema.createTable('flagged_clients', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('RESTRICT');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('RESTRICT');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('RESTRICT');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_clients');
