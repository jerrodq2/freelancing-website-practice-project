'use strict';


exports.up = (knex) => knex.schema.createTable('clients', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('first_name').notNullable();
	table.string('last_name').notNullable();
	table.string('username').notNullable().unique();
	table.string('email').notNullable().unique();
	table.enum('gender', ['male, female']).notNullable();
	table.uuid('field_id').notNullable().references('id').inTable('fields').onDelete('RESTRICT');
	table.text('summary').nullable();
	table.string('state').nullable();
	table.string('city').nullable();
	table.string('zip').nullable();
	table.string('phone').nullable();
	table.date('dob').nullable();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('clients');
