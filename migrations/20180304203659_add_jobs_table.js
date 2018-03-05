'use strict';


exports.up = (knex) => knex.schema.createTable('jobs', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('title').notNullable();
	table.uuid('field_id').notNullable().references('id').inTable('fields').onDelete('RESTRICT');
	table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
	table.uuid('freelancer_id').nullable().references('id').inTable('freelancers').onDelete('RESTRICT');
	table.integer('rate').notNullable();
	table.enum('rate_type', ['hourly, flat']).notNullable().defaultTo('hourly');
	table.text('description').notNullable();
	table.string('state').nullable();
	table.string('city').nullable();
	table.string('zip').nullable();
	table.boolean('onsite_required').notNullable();
	table.boolean('open').notNullable().defaultTo(true);
	table.enum('experience_level_requested', ['entry', 'intermediate', 'expert', 'any']).notNullable().defaultTo('any');
	table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('jobs');
