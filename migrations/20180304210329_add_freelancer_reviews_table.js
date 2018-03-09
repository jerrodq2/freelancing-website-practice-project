'use strict';


// This table is for reviews a client gives on a freelancer
exports.up = (knex) => knex.schema.createTable('freelancer_reviews', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.integer('rating').notNullable();
	table.text('review').notNullable();
	table.uuid('freelancer_id').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('client_id').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('job_id').nullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.timestamps();

});

exports.down = (knex) => knex.schema.dropTable('freelancer_reviews');
