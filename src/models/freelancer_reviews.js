'use strict';


const Model = require('./model');
const Freelancer_reviews = new Model('freelancer_reviews');
const _ = require('lodash');


module.exports = {
	// Should we have more specific methods, like finding all reviews that have been written by a client or about a freelancer?

	getAll () {
		// need to determine what I will pull from get all, client/freelancer names? Anything? Or just the review/rating?
	},

	findOne (id) {
		return Freelancer_reviews.findReview(id);
	},

	create (data) {
		return Freelancer_reviews.create(data);
	},

	update (id, data) {
		return Freelancer_reviews.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	delete (id) {
		return Freelancer_reviews.delete(id);
	}

};
