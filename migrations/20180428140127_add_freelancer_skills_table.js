'use strict';

// Creates the freelancer_skills table, used as a middle man between the many to many relationships of the freelancers and skills tables. For practicality sake, a freelancer can only have up to 20 skills for now
exports.up = (knex) => knex.schema.createTable('freelancer_skills', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.uuid('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE');
	table.string('skill_alias').notNullable(); // this allows two uses to have the html skill but it show up in their profiles how they type it, ex: 'html' in one but 'HTML' for another user
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('freelancer_skills');
