'use strict';

// Creates the freelancer_skills table, used as a middle man between the many to many relationships of the freelancers and skills tables. For practicality sake, a freelancer can only have 20 skills for now
exports.up = (knex) => knex.schema.createTable('freelancer_skills', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('freelancer_skills');
