'use strict';


const { format } = require('date-fns');
const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('education_history').del()

		.then(function () {
		// Inserts seed entries
			return knex('education_history').insert([
				{
					degree: 'Bachelors',
					school: 'Texas Tech University',
					area_of_study: 'IT',
					start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
					end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					degree: 'n/a',
					school: 'Coding Dojo',
					area_of_study: 'Full Stack Wev Development',
					start_date: format(new Date(2016, 8, 1), 'YYYY-MM-DD'),
					end_date: format(new Date(2016, 12, 24), 'YYYY-MM-DD'),
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					degree: 'Masters',
					school: 'Texas Tech University',
					area_of_study: 'IT',
					start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
					end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					degree: 'Bachelors',
					school: 'University Of North Texas',
					area_of_study: 'IT',
					start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
					end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
					freelancer_id: freelancers.jessica,
					created_at: new Date()
				}
			]);
		});
};
