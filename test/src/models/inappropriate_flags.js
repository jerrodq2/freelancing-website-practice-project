'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const InappropriateFlags = require(`${process.cwd()}/src/models/inappropriate_flags`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);
const Proposals = require(`${process.cwd()}/src/models/proposals`);
const Invitations = require(`${process.cwd()}/src/models/invitations`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Inappropriate Flags Model', () => {
	const id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(),
		freelancer_id = random.guid(),
		field_id = random.guid(),
		data = { id, job_id, freelancer_who_flagged: freelancer_id };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.job({ id: job_id, field_id, freelancer_id, client_id });
		await random.inappropriate_flag(data);
	});


	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_id, freelancer_id, client_review_id, freelancer_review_id, proposal_id, and invitation_id', () => {

	});
});
