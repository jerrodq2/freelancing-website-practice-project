'use strict';


// creates the flagged_invitations table. This is for invitations that have been flagged as inappropriate. It also saves the client or freelancer who created the flag or who flagged the invitation in question.
exports.up = (knex) => knex.schema.createTable('flagged_invitations', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('invitation_id').notNullable().references('id').inTable('invitations').onDelete('RESTRICT');
	table.uuid('client_who_flagged').nullable().references('id').inTable('clients').onDelete('RESTRICT');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('RESTRICT');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_invitations');
