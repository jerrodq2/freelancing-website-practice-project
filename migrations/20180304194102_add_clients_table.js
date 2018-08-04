'use strict';


const { ALL_STATES } = require(`${process.cwd()}/src/lib/constants`);

// creates the clients table, these are users that post jobs for freelancers. They can also use the 'invitations' table to invite a freelancer to a specific job

// TODO: setup Regex for phone, zipcode, dob, and email via routes and Joi
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
	table.boolean('active').notNullable().defaultTo(true);
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('clients');
