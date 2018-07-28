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

		it('should allow you to create a new flagged_freelancer if given valid data with the flag being created by a freelancer (freelancer_who_flagged), create new created_at and updated_at fields, and return the new flagged_freelancer object', async() => {
			const specificId = random.guid(),
				obj = { id: specificId, freelancer_who_flagged, client_who_flagged: null },
				createData = Object.assign({}, data, obj),
				flagged_freelancer = await FlaggedFreelancers.create(createData);

			checkFields(flagged_freelancer, specificId, freelancer_id, null, freelancer_who_flagged);
		});

		it('shouldn\'t allow a freelancer to be flagged twice by the same client and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificFreelancerId = createData.freelancer_id,
				flagged_freelancer = await FlaggedFreelancers.create(createData);

			checkFields(flagged_freelancer, specificId, specificFreelancerId);
			createData.id = secondId;

			try {
				await FlaggedFreelancers.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_freelancer');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('client');
				expect(message).to.include('already flagged');
			}
		});

		it('shouldn\'t allow a freelancer to be flagged twice by the same freelancer and should raise an exception on the second attempt', async() => {
			const specificData = await createNewData(),
				specificId = specificData.id,
				secondId = random.guid(),
				specificFreelancerId = specificData.freelancer_id,
				obj = { client_who_flagged: null, freelancer_who_flagged },
				createData = Object.assign({}, specificData, obj ),
				flagged_freelancer = await FlaggedFreelancers.create(createData);

			checkFields(flagged_freelancer, specificId, specificFreelancerId, null, freelancer_who_flagged);
			createData.id = secondId;

			try {
				await FlaggedFreelancers.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_freelancer');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedFreelancers, 'flagged_freelancer', 'create', createData);
		});

		it('should require either freelancer_who_flagged or client_who_flagged and should raise an exception if given neither', async() => {
			const createData = await createNewData();
			createData.client_who_flagged = null;

			return checkErr.checkNotNull(FlaggedFreelancers, 'flagged_freelancer', createData, 'freelancer_who_flagged and client_who_flagged');
		});

		it('should require a freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedFreelancers, 'flagged_freelancer', createData, 'freelancer_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedFreelancers, 'flagged_freelancer', createData, 'reason');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedFreelancers, 'flagged_freelancer', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedFreelancers, 'flagged_freelancer', 'create', createData, 'client_who_flagged', random.guid());
		});

		it('should raise an exception if given an incorrect freelancer_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();
			createData.client_who_flagged = null;
			createData.freelancer_who_flagged = freelancer_who_flagged;

			return checkErr.checkForeign(FlaggedFreelancers, 'flagged_freelancer', 'create', createData, 'freelancer_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
