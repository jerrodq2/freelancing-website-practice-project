'use strict';


const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);
const clients = require(`${process.cwd()}/seeds/ids/clients`);
const jobs = require(`${process.cwd()}/seeds/ids/jobs`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('freelancer_reviews').del()

		.then(function () {
		// Inserts seed entries
			return knex('freelancer_reviews').insert([
				{
					rating: 5,
					review: 'Naruto was amazing, really knew what he was doing, and man was he great at multitasking!',
					freelancer_id: freelancers.naruto,
					client_id: clients.sherlock,
					job_id: jobs.wordpress,
					created_at: new Date()
				},
			]);
		});
};
