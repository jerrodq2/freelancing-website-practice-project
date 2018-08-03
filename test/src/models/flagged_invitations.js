'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedInvitations = require(`${process.cwd()}/src/models/flagged_invitations`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Invitations = require(`${process.cwd()}/src/models/invitations`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Invitations Model', () => {
	// only freelancers can create a flagged_invitation
	const id = random.guid(),
		invitation_id = random.guid(),
		client_id = random.guid(), // the client that writes the invitation, saves us having to create a client for each one
		freelancer_id = random.guid(), // the freelancer that each invitation will be for, saves us having to create a freelancer for each one
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, invitation_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancers, used in the tests below
	const title = random.word(),
		description = random.paragraph(),
		first_name = random.name(),
		last_name = random.name(),

		invitationData = { id: invitation_id, client_id, freelancer_id, title, description },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name, last_name };


	before(async() => {
		await db.resetAll();
		// await random.field({ id: field_id });
		// await random.client({ id: client_id, field_id });
		// await random.freelancer({ id: freelancer_id, field_id });
		// await random.invitation(invitationData);
		// await random.freelancer(freelancerData);
		// await random.flagged_invitation(data);
		await random.flagged_invitations();
	});

	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on invitation_id and freelancer_who_flagged', () => {

	});
});
