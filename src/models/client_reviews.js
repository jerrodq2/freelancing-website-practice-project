'use strict';


const Model = require('./model');
const Client_reviews = new Model('client_reviews');


module.exports = {
	// Should we have more specific methods, like finding all reviews that have been written by a freelancer or about a client?

	getAll () {
		// need to determine what I will pull from get all, client/freelancer names? Anything? Or just the review/rating?
	},

	findOne (id) {
		return Client_reviews.findReview(id);
	},

	create (data) {
		return Client_reviews.create(data);
	},

	update (id, data) {
		return Client_reviews.updateById(id, data);
	},

	delete (id) {
		return Client_reviews.delete(id);
	}

};
