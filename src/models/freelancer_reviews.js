'use strict';


const Model = require('./main_model');
const Jobs = require('./jobs');
const { Boom } = require(`${process.cwd()}/src/lib/errors`);
const FreelancerReviews = new Model('freelancer_reviews');


module.exports = {
	// TODO: Should we have more specific methods? like finding all reviews that have been written by a client or about a freelancer?

	// TODO: ensure that there can only be one review per client-job-freelancer. Meaning a client can only write a review for a freelancer once per relevant job. They can only write a second review about that freelancer if they take another job with that freelancer.

	async create (data) {
		const { job_id } = data;
		const job = await Jobs.findOne(job_id);
		
		if (job.closed === false) {
			const message = 'You can\'t write a freelancer_review about this job, it hasn\'t been completed yet.';

			throw Boom.badRequest(message);
		}
		return FreelancerReviews.create(data);
	},

	getAll () {
		// TODO: need to determine what I will pull from get all, client/freelancer names? Anything? Or just the review/rating?
	},

	findOne (id) {
		return FreelancerReviews.findReview(id);
	},

	update (id, data) {
		return FreelancerReviews.updateById(id, data);
	},

	delete (id) {
		return FreelancerReviews.delete(id);
	}

};
