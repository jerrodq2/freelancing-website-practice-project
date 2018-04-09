'use strict';


// creates the admin table. Like it sounds, these are users that have admin privileges, they are not mean to post or accept jobs
exports.up = (knex) => knex.schema.createTable('admins', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('first_name').notNullable();
	table.string('last_name').notNullable();
	table.string('username').notNullable().unique();
	table.string('email').notNullable().unique();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('admins');
