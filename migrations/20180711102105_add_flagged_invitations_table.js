'use strict';


// creates the flagged_invitations table. This is for invitations that have been flagged as inappropriate. Since invitations are only sent to freelancers (created by clients), only a freelancer can create this flag.
exports.up = (knex) => knex.schema.createTable('flagged_invitations', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('invitation_id').notNullable().references('id').inTable('invitations').onDelete('CASCADE');
	table.uuid('freelancer_who_flagged').nullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.string('reason').notNullable();
	table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('flagged_invitations');
