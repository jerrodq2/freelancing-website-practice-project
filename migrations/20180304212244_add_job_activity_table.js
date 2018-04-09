'use strict';


// creates the job_activity table. Used just for freelancers, it shows jobs that clients have worked on, their past freelance history for this site basically
exports.up = (knex) => knex.schema.createTable('job_activity', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('job_activity');
