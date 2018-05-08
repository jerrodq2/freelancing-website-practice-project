'use strict';


// the invitations table is for when a client invites a freelancer to do a job
exports.up = (knex) => knex.schema.createTable('invitations', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('title').notNullable();
	table.text('description').notNullable();
	table.date('requested_time_limit').nullable().index();
	table.enum('status', ['pending', 'accepted', 'rejected']).notNullable().defaultTo('pending');
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('invitations');
