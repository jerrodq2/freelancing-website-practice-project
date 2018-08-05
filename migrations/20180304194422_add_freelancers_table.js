'use strict';


const { ALL_STATES } = require(`${process.cwd()}/src/lib/constants`);

// creates the freelancers table. These are users that accept jobs from clients. They can use the 'proposals' table to send a proposal for a job, basically saying why they should get the job and asking the client to give them that job

// TODO: setup Regex for phone, zipcode, dob, and email via routes and Joi
exports.up = (knex) => knex.schema.createTable('freelancers', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('first_name').notNullable();
	table.string('last_name').notNullable();
	table.string('username').notNullable().unique();
	table.string('email').notNullable().unique();
	table.string('job_title').notNullable().index();
	table.integer('rate').notNullable().index();
	table.enum('gender', ['male', 'female']).notNullable();
	table.integer('age').notNullable();
	table.uuid('field_id').notNullable().references('id').inTable('fields').onDelete('RESTRICT');
	table.text('summary').nullable();
	table.enum('state', ALL_STATES).nullable();
	table.string('city').nullable();
	table.string('zip').nullable().index();
	table.string('phone').nullable();
	table.date('dob').nullable();
	table.enum('experience_level', ['entry', 'intermediate', 'expert']).notNullable().index();
	table.string('video_url').nullable();
	table.string('portfolio_url').nullable();
	table.boolean('available').notNullable().defaultTo(true).index();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('freelancers');
