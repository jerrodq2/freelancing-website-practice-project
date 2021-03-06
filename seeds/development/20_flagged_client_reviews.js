'use strict';


// This file seeds the database with starting flagged client reviews using the already inserted clients and client reviews
const miscIds = require(`${process.cwd()}/seeds/ids/misc`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const FlaggedClientReviews = require(`${process.cwd()}/src/services/flags/models/flagged_client_reviews`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_client_reviews').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedClientReviews.create({
			client_review_id: miscIds.jessica_review,
			client_who_flagged: clientIds.natasha,
			reason: 'She\'s just attacking me personally',
		}),
	]);

};
