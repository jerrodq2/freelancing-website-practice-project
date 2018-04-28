'use strict';


exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('skills').del()

		.then(function () {
		// Inserts seed entries
			return knex('skills').insert([
				{
					skill: 'MEAN',
					created_at: new Date()
				},
				{
					skill: 'NodeJS',
					created_at: new Date()
				},
				{
					skill: 'Ruby on Rails',
					created_at: new Date()
				},
				{
					skill: 'ReactJS',
					created_at: new Date()
				},
				{
					skill: 'AngularJS',
					created_at: new Date()
				},
				{
					skill: '.Net',
					created_at: new Date()
				},
				{
					skill: 'HTML',
					created_at: new Date()
				},
				{
					skill: 'CSS',
					created_at: new Date()
				},
				{
					skill: 'Bootstrap',
					created_at: new Date()
				},
				{
					skill: 'jQuery',
					created_at: new Date()
				},
				{
					skill: 'SQL',
					created_at: new Date()
				},
				{
					skill: 'MySQL',
					created_at: new Date()
				},
				{
					skill: 'Analyst',
					created_at: new Date()
				},
				{
					skill: 'Wordpress',
					created_at: new Date()
				},
			]);
		});
};
