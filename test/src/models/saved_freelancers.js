'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedFreelancers = require(`${process.cwd()}/src/models/saved_freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Saved Freelancers Model', () => {
	// data used to create the saved_freelancer
	const id = random.guid(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		data = { id, freelancer_id, client_id };

	// data used to create the freelancer and client, used in tests below
	const field_id = random.guid(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };

	before(async() => {
		// clearing these two tables will clear saved_freelancers via cascading delete
		await db.resetTable('clients');
		await db.resetTable('freelancers');

		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		// await random.saved_freelancer(data);
	});


	// creates the necessary fields to create a new saved_freelancer record. Needs a new client for each record
	const createNewData = async() => {
		const specificId = random.guid(),
			specificFreelancerId = random.guid(),
			obj = { id: specificId, freelancer_id: specificFreelancerId };

		await random.freelancer({ id: specificFreelancerId, field_id });

		const createData = Object.assign({}, data, obj);
		return createData;
	};

	// checks all fields in a given saved_freelancers record
	const checkFields = (obj, givenId, givenFreelancerId = freelancer_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(givenFreelancerId);
		expect(obj.client_id).to.equal(client_id);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new saved_freelancer record if given valid data, create new updated_at and updated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = createData.freelancer_id,
				saved_freelancer = await SavedFreelancers.create(createData);

			checkFields(saved_freelancer, specificId, specificFreelancerId);
		});

		it('should only allow a client to save a freelancer once, and raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = createData.freelancer_id,
				secondId = random.guid(),
				saved_freelancer = await SavedFreelancers.create(createData);

			checkFields(saved_freelancer, specificId, specificFreelancerId);

			createData.id = secondId;
			try {
				await SavedFreelancers.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('saved_freelancer');
				expect(message).to.include('trying to create can\'t be completed');
				expect(message).to.include('already saved the freelancer');
				expect(message).to.include(specificFreelancerId);
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(SavedFreelancers, 'saved_freelancer', 'create', createData);
		});


		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(SavedFreelancers, 'saved_freelancer', createData, 'freelancer_id');
		});

		it('should require the client_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(SavedFreelancers, 'saved_freelancer', createData, 'client_id');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(SavedFreelancers, 'saved_freelancer', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(SavedFreelancers, 'saved_freelancer', 'create', createData, 'client_id', random.guid());
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id and client_id', () => {

	});
});
