'use strict';


// creates the flagged_freelancer_reviews table. This is for freelancer_reviews that have been flagged as inappropriate. Since freelancer_reviews are only created by clients, only a freelancer can create this flag.
exports.up = (knex) => knex.schema.createTable('flagged_freelancer_reviews', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_review_id').notNullable().references('id').inTable('freelancer_reviews').onDelete('CASCADE');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_freelancer_reviews');
