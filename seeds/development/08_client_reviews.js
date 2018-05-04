'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);

// TODO: More seed reviews
exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('client_reviews').del();
	// Inserts seed entries
	return Promise.all([
		ClientReviews.create({
			rating: 5,
			review: 'Sherlock was a great client, very smart, knew what he wanted, and was clear and concise about what he wanted and needed.',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
			job_id: jobIds.wordpress
		}),
	]);
};
