'use strict';


exports.up = (knex) => knex.schema.createTable('saved_freelancers', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('saved_freelancers');
