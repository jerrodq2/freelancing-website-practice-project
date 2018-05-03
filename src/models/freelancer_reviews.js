'use strict';


const Model = require('./model');
const FreelancerReviews = new Model('freelancer_reviews');


module.exports = {
	// TODO: Should we have more specific methods? like finding all reviews that have been written by a client or about a freelancer?

	getAll () {
		// TODO: need to determine what I will pull from get all, client/freelancer names? Anything? Or just the review/rating?
	},

	findOne (id) {
		return FreelancerReviews.findReview(id);
	},

	create (data) {
		return FreelancerReviews.create(data);
	},

	update (id, data) {
		return FreelancerReviews.updateById(id, data);
	},

	delete (id) {
		return FreelancerReviews.delete(id);
	}

};
