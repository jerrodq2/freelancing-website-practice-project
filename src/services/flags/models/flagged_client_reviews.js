'use strict';


// This file creates the flagged_client_reviews model as a new instance of the flag_model
const Model = require('./flag_model');
const FlaggedClientReviews = new Model('flagged_client_reviews');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.client_review_id)
			throw Errors.badNull('flagged_client_review', 'create', 'client_review_id');

		return FlaggedClientReviews.createFlag(data, 'client_review');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		const clientReviewColumns = ['cr.id as client_review_id', 'cr.review as client_review_review_text'],
			joinText = ['client_reviews as cr', 'flagged_client_reviews.client_review_id', 'cr.id'];

		return FlaggedClientReviews.findOneFlag(id, clientReviewColumns, joinText);
	},


	delete (id) {
		return FlaggedClientReviews.delete(id);
	}
};
