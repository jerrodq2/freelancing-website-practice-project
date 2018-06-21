'use strict';


const Model = require('./main_model');
const Jobs = require('./jobs');
const { Boom } = require(`${process.cwd()}/src/lib/errors`);
const FreelancerReviews = new Model('freelancer_reviews');


module.exports = {
	async create (data) {
		const { job_id } = data;
		const job = await Jobs.findOne(job_id);

		// the job must be finished to write a review about it, aka: closed must be true
		if (job.closed === false) {
			const message = 'You can\'t write a freelancer_review about this job, it hasn\'t been completed yet.';

			throw Boom.badRequest(message);
		}
		return FreelancerReviews.create(data);
	},


	// get all of the reviews written about a specific freelancer
	getAllReviews () {
		// TODO: setup later with pagination, add to tests after
	},


	// get all of the reviews written by a specific client
	getAll () {
		// TODO: setup later with pagination, add to tests after
	},


	findOne (id) {
		return FreelancerReviews.findReview(id);
	},


	// TODO: Should you be able to update the job, client, or freelancer? Currently not testing for it, maybe just restrict the object keys during the route with joy?
	update (id, data) {
		return FreelancerReviews.updateById(id, data);
	},


	delete (id) {
		return FreelancerReviews.delete(id);
	}

};
