'use strict';


const Model = require('./main_model');
const FreelancerReviews = new Model('freelancer_reviews');


module.exports = {
	// TODO: Should we have more specific methods? like finding all reviews that have been written by a client or about a freelancer?

	// TODO: ensure that there can only be one review per client-job-freelancer. Meaning a client can only write a review for a freelancer once per relevant job. They can only write a second review about that freelancer if they take another job with that freelancer.

	// TODO: Ensure that reviews can only be written after the job is finished/closed (pre-create check), and make sure you give appropriate error message when trying to create a second review for the same job (unique field)
	create (data) {
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
