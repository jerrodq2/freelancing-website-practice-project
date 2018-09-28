'use strict';


// This file seeds the database with starting client reviews using the already inserted clients, freelancers, and jobs
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const otherIds = require(`${process.cwd()}/seeds/ids/misc`);
const ClientReviews = require(`${process.cwd()}/src/services/reviews/models/client_reviews`);

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

		ClientReviews.create({
			rating: 4,
			review: 'Grumpy but you can work with him',
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.bruce,
			job_id: jobIds.batwing
		}),

		ClientReviews.create({
			rating: 5,
			review: 'Great client to work with!',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
			job_id: jobIds.personal_website
		}),

		ClientReviews.create({
			rating: 5,
			review: 'Great client to work with, very relaxed, open to suggestions, and knows what he wants.',
			freelancer_id: freelancerIds.izuku,
			client_id: clientIds.peter,
			job_id: jobIds.ecommerce_repair_site
		}),

		ClientReviews.create({
			id: otherIds.jessica_review,
			rating: 1,
			review: 'She was rude',
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.natasha,
			job_id: jobIds.full_stack_site
		}),
	]);
};
