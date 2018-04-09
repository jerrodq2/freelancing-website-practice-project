'use strict';


// creates the fields table, where a job/freelancer specify their field, ex: front end, web development, full stack, etc.
exports.up = (knex) => knex.schema.createTable('fields', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('field').notNullable();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('fields');
