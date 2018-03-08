'use strict';


const fields = require(`${process.cwd()}/seeds/ids/fields`);
const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('freelancers').del()

		.then(function () {
		// Inserts seed entries
			return knex('freelancers').insert([
				{
					id: freelancers.jerrod,
					first_name: 'Jerrod',
					last_name: 'Quintana',
					username: 'jerrod',
					email: 'j@j.com',
					job_title: 'Full Stack Web Developer',
					rate: 45,
					gender: 'male',
					field_id: fields.full_stack,
					summary: 'full stack web developer proficient with Node.js, Ruby on Rails, .Net, React, Angular, and Wordpress',
					state: 'TX',
					city: 'Dallas',
					experience_level: 'expert',
					created_at: new Date()
				},

				{
					id: freelancers.ryan,
					first_name: 'Ryan',
					last_name: 'Quintana',
					username: 'ryan',
					email: 'r@r.com',
					job_title: 'Front End Web Developer',
					rate: 33,
					gender: 'male',
					field_id: fields.front_end,
					summary: '7 years of experience building breathtaking front end websites',
					state: 'TX',
					city: 'Dallas',
					experience_level: 'intermediate',
					created_at: new Date()
				},

				{
					id: freelancers.jessica,
					first_name: 'Jessica',
					last_name: 'Jones',
					username: 'jessica',
					email: 'jjones@j.com',
					job_title: 'database',
					rate: 20,
					gender: 'female',
					field_id: fields.database,
					state: 'TX',
					city: 'Austin',
					experience_level: 'entry',
					created_at: new Date()
				},

				{
					id: freelancers.naruto,
					first_name: 'Naruto',
					last_name: 'Uzumaki',
					username: 'naruto',
					email: 'n@u.com',
					job_title: 'Wordpress Developer',
					rate: 30,
					gender: 'male',
					field_id: fields.front_end,
					summary: 'I specialize in all things Wordpress, taijutsu, ninjutsu, talk no jutsu, etc.',
					state: 'TX',
					city: 'Dallas',
					experience_level: 'expert',
					created_at: new Date()
				}
			]);
		});
};
