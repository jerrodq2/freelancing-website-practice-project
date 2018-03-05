'use strict';


exports.up = (knex) => knex.schema.createTable('employment_history', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('title').notNullable();
	table.string('company').notNullable();
	table.date('start_date').notNullable();
	table.date('end_date').notNullable();
	table.text('summary').notNullable();
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.timestamps();

});

exports.down = (knex) => knex.schema.dropTable('employment_history');
