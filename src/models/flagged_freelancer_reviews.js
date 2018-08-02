'use strict';


const Model = require('./flag_model');
const FlaggedFreelancerReviews = new Model('flagged_freelancer_reviews');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.freelancer_review_id)
			throw Errors.badNull('flagged_freelancer_review', 'create', 'freelancer_review_id');

		return FlaggedFreelancerReviews.createFlag(data, 'freelancer_review');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		const freelancerReviewColumns = ['fr.id as freelancer_review_id', 'fr.review as freelancer_review_review_text'],
			joinText = ['freelancer_reviews as fr', 'flagged_freelancer_reviews.freelancer_review_id', 'fr.id'];

		return FlaggedFreelancerReviews.findOneFlag(id, freelancerReviewColumns, joinText);
	},


	delete (id) {
		return FlaggedFreelancerReviews.delete(id);
	}
};
