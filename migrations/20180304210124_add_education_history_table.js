'use strict';


// creates the education_history table, used just for freelancers to specify their relevant education history
exports.up = (knex) => knex.schema.createTable('education_history', (table) => {
	table.uuid('id').notNullable().primary().defaultTo(knex.raw('gen_random_uuid()'));
	table.string('degree').notNullable();
	table.string('school').notNullable();
	table.string('area_of_study').notNullable();
	table.date('start_date').notNullable();
	table.date('end_date').notNullable();
	table.text('description').nullable();
	table.uuid('freelancer_id').notNullable().references('id').inTable('freelancers').onDelete('CASCADE');
	table.timestamps();

});

exports.down = (knex) => knex.schema.dropTable('education_history');
