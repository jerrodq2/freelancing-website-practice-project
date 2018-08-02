'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedProposals = require(`${process.cwd()}/src/models/flagged_proposals`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Proposals = require(`${process.cwd()}/src/models/proposals`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Proposals Model', () => {
	// only clients can create a flagged_proposal
	const id = random.guid(),
		proposal_id = random.guid(),
		client_id = random.guid(), // the client that each proposal will be for, saves us having to create a client for each one
		freelancer_id = random.guid(), // the freelancer that writes the proposal, saves us having to create a freelancer for each one
		client_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, proposal_id, client_who_flagged, reason };

	// variables used to specify fields of the clients and freelancers, used in the tests below
	const title = random.word(),
		description = random.paragraph(),
		first_name = random.name(),
		last_name = random.name(),

		proposalData = { id: proposal_id, client_id, freelancer_id, title, description },

		clientData = { id: client_who_flagged, field_id, first_name, last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.proposal(proposalData);
		await random.client(clientData);
		await random.flagged_proposal(data);
	});

	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on proposal_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
