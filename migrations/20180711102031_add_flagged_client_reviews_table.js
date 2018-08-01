'use strict';


// creates the flagged_client_reviews table. This is for client_reviews that have been flagged as inappropriate. It also saves the client or freelancer who created the flag or who flagged the client_reviews in question.
exports.up = (knex) => knex.schema.createTable('flagged_client_reviews', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('client_review_id').notNullable().references('id').inTable('client_reviews').onDelete('CASCADE');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_client_reviews');
