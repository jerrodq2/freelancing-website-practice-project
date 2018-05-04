'use strict';


// creates the client_reviews table. These are reviews that freelancers give about clients they have worked with. They can only write a review about a specific job that they worked with said client on, hence why there is a job id, only one review per client-job-freelancer relationship. For multiple reviews, they have to work with the client on multiple jobs
exports.up = (knex) => knex.schema.createTable('client_reviews', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.integer('rating').notNullable();
	table.text('review').notNullable();
	table.uuid('freelancer_id').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('client_id').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('job_id').nullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.timestamps();

});

exports.down = (knex) => knex.schema.dropTable('client_reviews');
