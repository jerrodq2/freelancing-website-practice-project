'use strict';


const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);
const clients = require(`${process.cwd()}/seeds/ids/clients`);
const fields = require(`${process.cwd()}/seeds/ids/fields`);
const jobs = require(`${process.cwd()}/seeds/ids/jobs`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('jobs').del()

		.then(function () {
		// Inserts seed entries
			return knex('jobs').insert([
				{
					id: jobs.wordpress,
					title: 'Wordpress Developer Needed!',
					rate: 35,
					description: 'An expert level wordpress developer is needed!',
					experience_level_requested: 'expert',
					field_id: fields.front_end,
					client_id: clients.sherlock,
					freelancer_id: freelancers.naruto,
					open: false,
					created_at: new Date()
				},
				{
					id: jobs.batwing,
					title: 'Need help with the batwing',
					rate: 10000,
					rate_type: 'flat',
					description: 'Alfred is on vacation, batwing is giving me issues....',
					city: 'gotham',
					onsite_required: true,
					experience_level_requested: 'expert',
					field_id: fields.full_stack,
					client_id: clients.bruce,
					created_at: new Date()
				},
				{
					id: jobs.basic_website,
					title: 'Need a basic website to market my services',
					rate: 20,
					description: 'Just want to get my name out there',
					experience_level_requested: 'intermediate',
					field_id: fields.front_end,
					client_id: clients.jack,
					city: 'Dallas',
					state: 'TX',
					created_at: new Date()
				},
			]);
		});
};
