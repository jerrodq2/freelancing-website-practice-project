'use strict';


// creates the flagged_freelancers table. This is for freelancers who have been flagged as inappropriate. It also saves the client or freelancer who created the flag or who flagged the freelancer in question.
exports.up = (knex) => knex.schema.createTable('flagged_freelancers', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_freelancers');
