'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedProposals = require(`${process.cwd()}/src/models/flagged_proposals`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Proposals = require(`${process.cwd()}/src/models/proposals`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Flagged Proposals Model', () => {
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


	// simple function that creates a new proposal that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificProposalId = random.guid(),
			obj = { id: specificId, proposal_id: specificProposalId },
			createData = Object.assign({}, data, obj);

		await random.proposal({ id: specificProposalId, client_id, freelancer_id });
		return createData;
	};

	// checks all fields in a given flagged_proposal object
	const checkFields = (obj, givenId, specificProposalId = proposal_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.proposal_id).to.equal(specificProposalId);
		expect(obj.client_who_flagged).to.equal(client_who_flagged);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should allow you to create a new flagged_proposal if given valid data with the flag being created by a client (client_who_flagged), create new created_at and updated_at fields, and return the new flagged_proposal object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificProposalId = createData.proposal_id,
				flagged_proposal = await FlaggedProposals.create(createData);

			checkFields(flagged_proposal, specificId, specificProposalId);
		});

		it('shouldn\'t allow a proposal to be flagged twice by the same client and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificProposalId = createData.proposal_id,
				flagged_proposal = await FlaggedProposals.create(createData);

			checkFields(flagged_proposal, specificId, specificProposalId);
			createData.id = secondId;

			try {
				await FlaggedProposals.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_proposal');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('client');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedProposals, 'flagged_proposal', 'create', createData);
		});

		it('should require a proposal_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedProposals, 'flagged_proposal', createData, 'proposal_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedProposals, 'flagged_proposal', createData, 'reason');
		});


		it('should raise an exception if given an incorrect proposal_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedProposals, 'flagged_proposal', 'create', createData, 'proposal_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedProposals, 'flagged_proposal', 'create', createData, 'client_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific flagged_proposal record with a given id, and return the object with relevant information about the proposal that was flagged, the client who flagged it', async() => {
			const flagged_proposal = await FlaggedProposals.findOne(id);

			expect(flagged_proposal).to.be.an.object();
			expect(flagged_proposal.id).to.equal(id);
			expect(flagged_proposal.proposal_id).to.equal(proposal_id);
			expect(flagged_proposal.proposal_title).to.equal(title);
			expect(flagged_proposal.proposal_description).to.equal(description);
			expect(flagged_proposal.client_who_flagged).to.equal(client_who_flagged);
			expect(flagged_proposal.flagging_client_first_name).to.equal(first_name);
			expect(flagged_proposal.flagging_client_last_name).to.equal(last_name);
			expect(flagged_proposal.reason).to.equal(reason);
			expect(flagged_proposal.created_at).to.be.a.date();
			expect(flagged_proposal.updated_at).to.equal(null);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedProposals, 'flagged_proposal', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedProposals, 'flagged_proposal', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_proposal = await random.flagged_proposal(createData);

			expect(flagged_proposal).to.be.an.object();
			expect(flagged_proposal.id).to.equal(specificId);

			const result = await FlaggedProposals.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedProposals, 'flagged_proposal', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedProposals, 'flagged_proposal', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedProposals, 'flagged_proposal', 'delete', {});
		});
	});


	describe('has cascading delete on proposal_id and client_who_flagged', () => {
		it('should be deleted in the event of the proposal that was flagged is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificProposalId = createData.proposal_id,
				flagged_proposal = await random.flagged_proposal(createData);

			expect(flagged_proposal).to.be.an.object();
			expect(flagged_proposal.id).to.equal(specificId);
			expect(flagged_proposal.proposal_id).to.equal(specificProposalId);

			const result = await Proposals.delete(specificProposalId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedProposals, 'flagged_proposal', 'find', specificId);
		});

		it('should be deleted in the event of the client who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_proposal = await random.flagged_proposal(createData);

			expect(flagged_proposal).to.be.an.object();
			expect(flagged_proposal.id).to.equal(specificId);
			expect(flagged_proposal.client_who_flagged).to.equal(client_who_flagged);

			const result = await Clients.delete(client_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedProposals, 'flagged_proposal', 'find', specificId);
		});
	});
});
