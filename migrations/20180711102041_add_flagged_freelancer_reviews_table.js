'use strict';


// creates the flagged_freelancer_reviews table. This is for freelancer_reviews that have been flagged as inappropriate. It also saves the client or freelancer who created the flag or who flagged the freelancer_review in question.
exports.up = (knex) => knex.schema.createTable('flagged_freelancer_reviews', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_review_id').notNullable().references('id').inTable('freelancer_reviews').onDelete('RESTRICT');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('RESTRICT');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('RESTRICT');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_freelancer_reviews');
