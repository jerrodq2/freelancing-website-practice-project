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
			review: 'Naruto was amazing, really knew what he was doing, and man was he great at multitasking, it\'s like there was more than one of him!',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
			job_id: jobIds.wordpress
		}),

		FreelancerReviews.create({
			rating: 5,
			review: 'As always, grayson is one of the best',
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.bruce,
			job_id: jobIds.batwing
		}),

		FreelancerReviews.create({
			rating: 4,
			review: 'Very fast, he was able to answer all my questions and was very receptive. A few small bugs that had to be worked out in the beginning, nothing major.',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
			job_id: jobIds.personal_website
		}),

		FreelancerReviews.create({
			rating: 4,
			review: 'Very knowledgeable and skilled',
			freelancer_id: freelancerIds.izuku,
			client_id: clientIds.peter,
			job_id: jobIds.ecommerce_repair_site
		}),

		FreelancerReviews.create({
			rating: 2,
			review: 'Jessica was much better at the database specific portion of the project. On anything more full stack or front end related, she was very slow and the site ran into numerous issues and bugs. Worst of all, she told me she could do it in 2 weeks time, she took 3.',
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.natasha,
			job_id: jobIds.full_stack_site
		}),
	]);
};
