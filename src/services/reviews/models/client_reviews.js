'use strict';


// This file creates the client_review model as a new instance of the review_model
const Model = require('./review_model');
const ClientReviews = new Model('client_reviews');


module.exports = {
	create (data) {
		return ClientReviews.createReview(data);
	},

	// get all of the reviews written about a specific client
	getAllReviews () {
		// TODO: setup later with pagination, goes through the ReviewModel, add to tests after
	},


	// get all of the reviews written by a specific freelancer
	getAll () {
		// TODO: setup later with pagination, goes through the ReviewModel, add to tests after
	},


	findOne (id) {
		return ClientReviews.findReview(id);
	},


	update (id, data) {
		return ClientReviews.update(id, data);
	},


	delete (id) {
		return ClientReviews.delete(id);
	}

};
