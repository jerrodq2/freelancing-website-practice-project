'use strict';


const { ALL_STATES } = require(`${process.cwd()}/src/lib/constants`);

// creates the jobs table. These are contracts/projects that are posted by clients and accepted by freelancers. 
exports.up = (knex) => knex.schema.createTable('jobs', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('title').notNullable().index();
	table.uuid('field_id').notNullable().references('id').inTable('fields').onDelete('RESTRICT');
	table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('freelancer_id').nullable().references('id').inTable('freelancers').onDelete('RESTRICT');
	table.integer('rate').notNullable().index();
	table.enum('rate_type', ['hourly', 'flat']).notNullable().defaultTo('hourly').index();
	table.text('description').notNullable();
	table.enum('state', ALL_STATES).nullable();
	table.string('city').nullable();
	table.string('zip').nullable().index();
	table.boolean('onsite_required').notNullable().defaultTo(false);
	table.boolean('open').notNullable().defaultTo(true).index();
	table.enum('experience_level_requested', ['entry', 'intermediate', 'expert', 'any']).notNullable().defaultTo('any').index();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('jobs');
