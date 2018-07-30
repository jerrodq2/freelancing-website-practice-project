'use strict';


// creates the flagged_proposals table. This is for proposals that have been flagged as inappropriate. Since proposals are only sent to clients (created by freelancers), only a client can create this flag.
exports.up = (knex) => knex.schema.createTable('flagged_proposals', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('proposal_id').notNullable().references('id').inTable('proposals').onDelete('CASCADE');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_proposals');
