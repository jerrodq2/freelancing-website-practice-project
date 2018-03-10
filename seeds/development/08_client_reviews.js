'use strict';


const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);
const clients = require(`${process.cwd()}/seeds/ids/clients`);
const jobs = require(`${process.cwd()}/seeds/ids/jobs`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('client_reviews').del()

		.then(function () {
		// Inserts seed entries
			return knex('client_reviews').insert([
				{
					rating: 5,
					review: 'Sherlock was a great client, very smart, knew what he wanted, and was clear and concise about what he wanted and needed.',
					freelancer_id: freelancers.naruto,
					client_id: clients.sherlock,
					job_id: jobs.wordpress,
					created_at: new Date()
				},
			]);
		});
};
