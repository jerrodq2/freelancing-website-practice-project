'use strict';

const freelancers = require(`${process.cwd()}/seeds/ids/freelancers`);
const clients = require(`${process.cwd()}/seeds/ids/clients`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('reviews').del()

		.then(function () {
		// Inserts seed entries
			return knex('reviews').insert([
				{
					rating: 5,
					review: 'Naruto was amazing',
					freelancer_id: freelancers.naruto,
					client_id: clients.sherlock,
					created_at: new Date()
				},
			]);
		});
};
