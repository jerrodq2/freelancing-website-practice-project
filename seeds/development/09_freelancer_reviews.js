'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('freelancer_reviews').del();
	// Inserts seed entries
	return Promise.all([
		FreelancerReviews.create({
			rating: 5,
			review: 'Naruto was amazing, really knew what he was doing, and man was he great at multitasking!',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
			job_id: jobIds.wordpress
		}),
	]);
};
