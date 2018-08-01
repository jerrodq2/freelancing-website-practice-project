'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedClientReviews = require(`${process.cwd()}/src/models/flagged_client_reviews`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Client Reviews Model', () => {
	// create the first flag as a freelancer flagging a client_review
	const id = random.guid(),
		client_review_id = random.guid(),
		client_id = random.guid(), // the client that each review will be about, saves us having to create a client for each one
		freelancer_id = random.guid(), // the freelancer that writes review, saves us having to create a freelancer for each one
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, client_review_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancers, used in the tests below
	const review = random.sentence(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		reviewData = { id: client_review_id, client_id, freelancer_id, review },

		clientData = { id: client_who_flagged, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client_review(reviewData);
		await random.client(clientData);
		await random.freelancer(freelancerData);
		await random.flagged_client_review(data);
	});

	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
