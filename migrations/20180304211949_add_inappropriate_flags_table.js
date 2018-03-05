'use strict';


exports.up = (knex) => knex.schema.createTable('inappropriate_flags', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('job_id').nullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.uuid('client_id').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('freelancer_id').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('review_id').nullable().references('id').inTable('reviews').onDelete('CASCADE');
	table.uuid('proposal_id').nullable().references('id').inTable('proposals').onDelete('CASCADE');
	table.uuid('invitation_id').nullable().references('id').inTable('invitations').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('inappropriate_flags');
