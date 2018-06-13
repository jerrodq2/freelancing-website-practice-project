'use strict';


const random = new (require('chance'));
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);

// used to create a random freelancer_review. If given no parameters, randomizes all fields. It requires the freelancer_id, client_id, and job_id to be given, for simplicity they're not created here.
module.exports = (opts = {}) => FreelancerReviews.create({
	id: opts.id || random.guid(),
	rating: opts.rating || random.integer({ min: 1, max: 20 }),
	review: opts.review || random.paragraph(),
	freelancer_id: opts.freelancer_id,
	client_id: opts.client_id,
	job_id: opts.job_id,
});
