'use strict';


const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('skills').del()

		.then(function () {
		// Inserts seed entries
			return knex('skills').insert([
				{
					skill: 'MEAN',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					skill: 'NodeJS',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					skill: 'Ruby on Rails',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					skill: 'ReactJS',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					skill: 'AngularJS',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					skill: '.Net',
					freelancer_id: freelancers.jerrod,
					created_at: new Date()
				},
				{
					skill: 'HTML',
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					skill: 'CSS',
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					skill: 'Bootstrap',
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					skill: 'jQuery',
					freelancer_id: freelancers.ryan,
					created_at: new Date()
				},
				{
					skill: 'SQL',
					freelancer_id: freelancers.jessica,
					created_at: new Date()
				},
				{
					skill: 'MySQL',
					freelancer_id: freelancers.jessica,
					created_at: new Date()
				},
				{
					skill: 'Analyst',
					freelancer_id: freelancers.jessica,
					created_at: new Date()
				},
				{
					skill: 'Wordpress',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
				{
					skill: 'Taijutsu',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
				{
					skill: 'Ninjutsu',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
				{
					skill: 'Chakra Control',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
				{
					skill: 'Kage Bunshin No Jutsu',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
				{
					skill: 'Being the number one ninja',
					freelancer_id: freelancers.naruto,
					created_at: new Date()
				},
			]);
		});
};
