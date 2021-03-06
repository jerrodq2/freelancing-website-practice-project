'use strict';


// creates the saved_jobs table. This is so freelancers can 'save' a job that they want to see later
exports.up = (knex) => knex.schema.createTable('saved_jobs', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('saved_jobs');
