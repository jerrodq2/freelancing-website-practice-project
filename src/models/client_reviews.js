'use strict';


const Model = require('./main_model');
const ClientReviews = new Model('client_reviews');


module.exports = {
	// TODO: Should we have more specific methods? like finding all reviews that have been written by a freelancer or about a client?

	getAll () {
		// TODO: need to determine what I will pull from get all, client/freelancer names? Anything? Or just the review/rating?
	},

	findOne (id) {
		return ClientReviews.findReview(id);
	},

	// TODO: ensure that there can only be on review per client-job-freelancer. Meaning a freelancer can only write a review for a client once per relevant job. They can only write a second review about that client if they take another job with that client.
	// TODO: Also ensure that reviews can only be written after the job is finished/closed
	create (data) {
		return ClientReviews.create(data);
	},

	update (id, data) {
		return ClientReviews.updateById(id, data);
	},

	delete (id) {
		return ClientReviews.delete(id);
	}

};
