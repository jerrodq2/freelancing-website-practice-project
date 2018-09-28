'use strict';


// This file seeds the database with starting flagged freelancers reviews using the already inserted freelancers and freelancer reviews
const miscIds = require(`${process.cwd()}/seeds/ids/misc`);
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const FlaggedFreelancerReviews = require(`${process.cwd()}/src/services/flags/models/flagged_freelancer_reviews`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_freelancer_reviews').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedFreelancerReviews.create({
			freelancer_review_id: miscIds.natasha_review,
			freelancer_who_flagged: freelancerIds.jessica,
			reason: 'She\'s lying',
		}),
	]);

};
