'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedClients = require(`${process.cwd()}/src/models/flagged_clients`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Clients Model', () => {
	// create the first flag as a freelancer flagging a client
	const id = random.guid(),
		client_id = random.guid(),
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, client_id, freelancer_who_flagged, reason };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.client({ id: client_who_flagged, field_id });
		await random.freelancer({ id: freelancer_who_flagged, field_id });
		await random.flagged_client(data);
	});


	// simple function that creates a new client that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificClientId = random.guid(),
			obj = { id: specificId, client_id: specificClientId },
			createData = Object.assign({}, data, obj);

		await random.client({ id: specificClientId, field_id });
		return createData;
	};

	// checks all fields in a given flagged_client object
	const checkFields = (obj, givenId, givenClientId = client_id, givenFlaggingClient = null, givenFlaggingFreelancer = freelancer_who_flagged) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.client_id).to.equal(givenClientId);
		expect(obj.client_who_flagged).to.equal(givenFlaggingClient);
		expect(obj.freelancer_who_flagged).to.equal(givenFlaggingFreelancer);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};

	describe('has a create method', () => {
		it('should create a new flagged_client if given valid data, create new created_at and updated_at fields, and return the new flagged_client object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id,
				flagged_client = await FlaggedClients.create(createData);

			checkFields(flagged_client, specificId, specificClientId);
		});
	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_id, freelancer_id, client_review_id, freelancer_review_id, proposal_id, and invitation_id', () => {

	});
});
