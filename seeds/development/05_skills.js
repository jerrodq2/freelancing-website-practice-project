'use strict';


exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('skills').del()

		.then(function () {
		// Inserts seed entries
			return knex('skills').insert([
				{
					skill: 'mean',
					created_at: new Date()
				},
				{
					skill: 'nodejs',
					created_at: new Date()
				},
				{
					skill: 'ruby on rails',
					created_at: new Date()
				},
				{
					skill: 'reactjs',
					created_at: new Date()
				},
				{
					skill: 'angularjs',
					created_at: new Date()
				},
				{
					skill: '.net',
					created_at: new Date()
				},
				{
					skill: 'html',
					created_at: new Date()
				},
				{
					skill: 'css',
					created_at: new Date()
				},
				{
					skill: 'bootstrap',
					created_at: new Date()
				},
				{
					skill: 'jquery',
					created_at: new Date()
				},
				{
					skill: 'sql',
					created_at: new Date()
				},
				{
					skill: 'mysql',
					created_at: new Date()
				},
				{
					skill: 'analyst',
					created_at: new Date()
				},
				{
					skill: 'wordpress',
					created_at: new Date()
				},
			]);
		});
};
