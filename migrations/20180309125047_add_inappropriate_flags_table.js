'use strict';


// creates the inappropriate_flags table. This is so that a job, client, freelancer, client_review, freelancer_review, proposal, or invitation can be marked as inappropriate. Flags are created by either a freelancer or client, comes with a message as to why it is being flagged. Only seen by admins
exports.up = (knex) => knex.schema.createTable('inappropriate_flags', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('job_id').nullable().references('id').inTable('jobs').onDelete('CASCADE');
	table.uuid('client_id').nullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('freelancer_id').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('client_review_id').nullable().references('id').inTable('client_reviews').onDelete('CASCADE');
	table.uuid('freelancer_review_id').nullable().references('id').inTable('freelancer_reviews').onDelete('CASCADE');
	table.uuid('proposal_id').nullable().references('id').inTable('proposals').onDelete('CASCADE');
	table.uuid('invitation_id').nullable().references('id').inTable('invitations').onDelete('CASCADE');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('CASCADE'); // client that created the flag
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('CASCADE'); // freelancer that created the flag
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('inappropriate_flags');
