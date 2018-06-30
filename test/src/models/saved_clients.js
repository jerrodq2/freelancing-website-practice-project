'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedClients = require(`${process.cwd()}/src/models/saved_clients`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Saved Clients Model', () => {
	// data used to create the saved_client
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
		// clearing these two tables will clear saved_clients via cascading delete
		await db.resetTable('clients');
		await db.resetTable('freelancers');

		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.saved_client(data);
	});


	// creates the necessary fields to create a new saved_client record. Needs a new client for each record
	const createNewData = async() => {
		const specificId = random.guid(),
			specificClientId = random.guid(),
			obj = { id: specificId, client_id: specificClientId };

		await random.client({ id: specificClientId, field_id });

		const createData = Object.assign({}, data, obj);
		return createData;
	};

	// checks all fields in a given saved_clients record
	const checkFields = (obj, givenId, givenClientId = client_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.client_id).to.equal(givenClientId);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new saved_client record if given valid data, create new created_at and updated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id,
				saved_client = await SavedClients.create(createData);

			checkFields(saved_client, specificId, specificClientId);
		});

		it('should only allow a freelancer to save a client once, and raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id,
				secondId = random.guid(),
				saved_client = await SavedClients.create(createData);

			checkFields(saved_client, specificId, specificClientId);

			createData.id = secondId;
			try {
				await SavedClients.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('saved_client');
				expect(message).to.include('trying to create can\'t be completed');
				expect(message).to.include('already saved the client');
				expect(message).to.include(specificClientId);
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(SavedClients, 'saved_client', 'create', createData);
		});


		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(SavedClients, 'saved_client', createData, 'freelancer_id');
		});

		it('should require the client_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(SavedClients, 'saved_client', createData, 'client_id');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(SavedClients, 'saved_client', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(SavedClients, 'saved_client', 'create', createData, 'client_id', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific saved_client with a given id, and return the object with relevant information about the client and freelancer', async() => {
			const saved_client = await SavedClients.findOne(id);

			// first check the fields that belong to the saved_client record
			checkFields(saved_client, id);

			expect(saved_client.client_first_name).to.equal(client_first_name);
			expect(saved_client.client_last_name).to.equal(client_last_name);
			expect(saved_client.freelancer_first_name).to.equal(freelancer_first_name);
			expect(saved_client.freelancer_last_name).to.equal(freelancer_last_name);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(SavedClients, 'saved_client', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(SavedClients, 'saved_client', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const saved_client = await random.saved_client(createData);
			expect(saved_client).to.be.an.object();
			expect(saved_client.id).to.equal(specificId);

			const result = await SavedClients.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(SavedClients, 'saved_client', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(SavedClients, 'saved_client', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(SavedClients, 'saved_client', 'delete', {});
		});
	});


	describe('has cascading delete on freelancer_id and client_id', () => {
		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			const saved_client = await SavedClients.create(createData);

			expect(saved_client).to.be.an.object();
			expect(saved_client.id).to.equal(specificId);
			expect(saved_client.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(SavedClients, 'saved_client', 'find', specificId);
		});

		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id;

			const saved_client = await SavedClients.create(createData);

			expect(saved_client).to.be.an.object();
			expect(saved_client.id).to.equal(specificId);
			expect(saved_client.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(SavedClients, 'saved_client', 'find', specificId);
		});
	});
});
