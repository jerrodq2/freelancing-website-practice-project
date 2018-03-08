'use strict';


const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);
const clients = require(`${process.cwd()}/seeds/ids/clients`);
const jobs = require(`${process.cwd()}/seeds/ids/jobs`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('proposals').del()

		.then(function () {
		// Inserts seed entries
			return knex('proposals').insert([
				{
					title: 'I can do it dattebayo',
					description: 'I can do it easily',
					freelancer_id: freelancers.naruto,
					client_id: clients.sherlock,
					job_id: jobs.wordpress,
					created_at: new Date()
				},
				{
					title: 'I can deal with it',
					description: 'Let me help you',
					freelancer_id: freelancers.jerrod,
					client_id: clients.bruce,
					job_id: jobs.batwing,
					created_at: new Date()
				},
				{
					title: 'I can solve your problem',
					description: 'I am a master at front end',
					freelancer_id: freelancers.ryan,
					client_id: clients.jack,
					job_id: jobs.basic_website,
					created_at: new Date()
				},
				{
					title: 'I can do it better than ryan',
					description: 'Always do',
					freelancer_id: freelancers.jerrod,
					client_id: clients.jack,
					job_id: jobs.basic_website,
					created_at: new Date()
				},
			]);
		});
};
