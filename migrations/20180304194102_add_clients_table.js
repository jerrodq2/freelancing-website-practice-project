'use strict';


const { ALL_STATES } = require(`${process.cwd()}/src/lib/constants`);

exports.up = (knex) => knex.schema.createTable('clients', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('first_name').notNullable();
	table.string('last_name').notNullable();
	table.string('username').notNullable().unique();
	table.string('email').notNullable().unique();
	table.enum('gender', ['male', 'female']).notNullable();
	table.integer('age').notNullable();
	table.uuid('field_id').notNullable().references('id').inTable('fields').onDelete('RESTRICT');
	table.text('summary').nullable();
	table.enum('state', ALL_STATES).nullable();
	table.string('city').nullable();
	table.string('zip').nullable().index();
	table.string('phone').nullable();
	table.date('dob').nullable();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('clients');
