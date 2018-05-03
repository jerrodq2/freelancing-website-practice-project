'use strict';


const Model = require('./model');
const ClientReviews = new Model('client_reviews');


module.exports = {
	// TODO: Should we have more specific methods? like finding all reviews that have been written by a freelancer or about a client?

	getAll () {
		// TODO: need to determine what I will pull from get all, client/freelancer names? Anything? Or just the review/rating?
	},

	findOne (id) {
		return ClientReviews.findReview(id);
	},

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
