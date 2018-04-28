'use strict';


// Creates the skills table, used just with freelancers for their skills, ex: Python, HTML, Wordpress. Due to this relationship being a many to many, it goes through the table freelancer_skills, which acts as the middle man. For practicality sake, a freelancer can only have 20 skills for now
exports.up = (knex) => knex.schema.createTable('skills', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('skill').notNullable();
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('skills');
