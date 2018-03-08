'use strict';


const { format } = require('date-fns');
const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('employment_history').del()

		.then(function () {
		// Inserts seed entries
			return knex('employment_history').insert([
				{
					title: 'solutions engineer',
					company: 'Think Smart',
					start_date: format(new Date(2017, 1, 1), 'YYYY-MM-DD'),
					present_job: true,
					summary: 'worked an amazing job at an amazing company',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					title: 'Front end developer',
					company: 'Google',
					start_date: format(new Date(2015, 5, 1), 'YYYY-MM-DD'),
					end_date: format(new Date(2016, 1, 1), 'YYYY-MM-DD'),
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					title: 'Front end developer',
					company: 'Verizon',
					start_date: format(new Date(2016, 2, 1), 'YYYY-MM-DD'),
					present_job: true,
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					title: 'Database developer',
					company: 'CREF',
					start_date: format(new Date(2017, 5, 1), 'YYYY-MM-DD'),
					end_date: format(new Date(2018, 2, 1), 'YYYY-MM-DD'),
					freelancer_id: freelancers.jessica,
					created_at: new Date()
				},
				{
					title: 'Hokage',
					company: 'Konoha',
					start_date: format(new Date(2011, 6, 1), 'YYYY-MM-DD'),
					present_job: true,
					summary: 'protecting konoha from the akatsuki, madara, and of course, sasukes shenanigans',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
			]);
		});
};
