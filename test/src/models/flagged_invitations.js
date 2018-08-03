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
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.invitation(invitationData);
		await random.freelancer(freelancerData);
		await random.flagged_invitation(data);
	});


	// simple function that creates a new invitation that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificInvitationId = random.guid(),
			obj = { id: specificId, invitation_id: specificInvitationId },
			createData = Object.assign({}, data, obj);

		await random.invitation({ id: specificInvitationId, client_id, freelancer_id });
		return createData;
	};

	// checks all fields in a given flagged_invitation object
	const checkFields = (obj, givenId, specificInvitationId = invitation_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.invitation_id).to.equal(specificInvitationId);
		expect(obj.freelancer_who_flagged).to.equal(freelancer_who_flagged);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should allow you to create a new flagged_invitation if given valid data with the flag being created by a freelancer (freelancer_who_flagged), create new created_at and updated_at fields, and return the new flagged_invitation object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificInvitationId = createData.invitation_id,
				flagged_invitation = await FlaggedInvitations.create(createData);

			checkFields(flagged_invitation, specificId, specificInvitationId);
		});

		it('shouldn\'t allow an invitation to be flagged twice by the same freelancer and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificInvitationId = createData.invitation_id,
				flagged_invitation = await FlaggedInvitations.create(createData);

			checkFields(flagged_invitation, specificId, specificInvitationId);
			createData.id = secondId;

			try {
				await FlaggedInvitations.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_invitation');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedInvitations, 'flagged_invitation', 'create', createData);
		});

		it('should require a invitation_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedInvitations, 'flagged_invitation', createData, 'invitation_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedInvitations, 'flagged_invitation', createData, 'reason');
		});


		it('should raise an exception if given an incorrect invitation_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedInvitations, 'flagged_invitation', 'create', createData, 'invitation_id', random.guid());
		});

		it('should raise an exception if given an incorrect freelancer_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedInvitations, 'flagged_invitation', 'create', createData, 'freelancer_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific flagged_invitation record with a given id, and return the object with relevant information about the invitation that was flagged, the freelancer who flagged it', async() => {
			const flagged_invitation = await FlaggedInvitations.findOne(id);

			expect(flagged_invitation).to.be.an.object();
			expect(flagged_invitation.id).to.equal(id);
			expect(flagged_invitation.invitation_id).to.equal(invitation_id);
			expect(flagged_invitation.invitation_title).to.equal(title);
			expect(flagged_invitation.invitation_description).to.equal(description);
			expect(flagged_invitation.freelancer_who_flagged).to.equal(freelancer_who_flagged);
			expect(flagged_invitation.flagging_freelancer_first_name).to.equal(first_name);
			expect(flagged_invitation.flagging_freelancer_last_name).to.equal(last_name);
			expect(flagged_invitation.reason).to.equal(reason);
			expect(flagged_invitation.created_at).to.be.a.date();
			expect(flagged_invitation.updated_at).to.equal(null);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedInvitations, 'flagged_invitation', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedInvitations, 'flagged_invitation', 'find', {});
		});
	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on invitation_id and freelancer_who_flagged', () => {

	});
});
