'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedFreelancers = require(`${process.cwd()}/src/models/flagged_freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Freelancers Model', () => {
	// create the first flag as a client flagging a freelancer
	const id = random.guid(),
		freelancer_id = random.guid(),
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, freelancer_id, client_who_flagged, reason };

	// variables used to specify fields of the client and freelancer, used in the tests below
	const client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		clientData = { id: client_who_flagged, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client(clientData);
		await random.freelancer(freelancerData);
		await random.flagged_freelancer(data);
	});


	// simple function that creates a new freelancer that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificFreelancerId = random.guid(),
			obj = { id: specificId, freelancer_id: specificFreelancerId },
			createData = Object.assign({}, data, obj);

		await random.freelancer({ id: specificFreelancerId, field_id });
		return createData;
	};

	// checks all fields in a given flagged_freelancer object
	const checkFields = (obj, givenId, givenFreelancerId = freelancer_id, givenFlaggingClient = client_who_flagged, givenFlaggingFreelancer = null) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(givenFreelancerId);
		expect(obj.client_who_flagged).to.equal(givenFlaggingClient);
		expect(obj.freelancer_who_flagged).to.equal(givenFlaggingFreelancer);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should allow you to create a new flagged_freelancer if given valid data with the flag being created by a client (client_who_flagged), create new created_at and updated_at fields, and return the new flagged_freelancer object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = createData.freelancer_id,
				flagged_freelancer = await FlaggedFreelancers.create(createData);

			checkFields(flagged_freelancer, specificId, specificFreelancerId);
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
