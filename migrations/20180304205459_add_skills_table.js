'use strict';


// Creates the skills table, used just with freelancers for their skills, ex: Python, HTML, Wordpress
exports.up = (knex) => knex.schema.createTable('skills', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('skill').notNullable();
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('skills');
