'use strict';


// creates the employment_history table, used just for freelancers to specify their relevant work history
exports.up = (knex) => knex.schema.createTable('employment_history', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('title').notNullable();
	table.string('company').notNullable();
	table.date('start_date').notNullable();
	table.date('end_date').nullable();
	table.boolean('present_job').notNullable().defaultTo(false);
	table.text('summary').nullable();
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.timestamps();

});

exports.down = (knex) => knex.schema.dropTable('employment_history');
