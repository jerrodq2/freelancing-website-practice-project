'use strict';


const Model = require('./review_model');
const FreelancerReviews = new Model('freelancer_reviews');


module.exports = {
	create (data) {
		return FreelancerReviews.createReview(data);
	},


	// get all of the reviews written about a specific freelancer
	getAllReviews () {
		// TODO: setup later with pagination, goes through the ReviewModel, add to tests after
	},


	// get all of the reviews written by a specific client
	getAll () {
		// TODO: setup later with pagination, goes through the ReviewModel, add to tests after
	},


	findOne (id) {
		return FreelancerReviews.findReview(id);
	},


	update (id, data) {
		return FreelancerReviews.update(id, data);
	},


	delete (id) {
		return FreelancerReviews.delete(id);
	}

};
