'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedClients = require(`${process.cwd()}/src/models/flagged_clients`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Flagged Clients Model', () => {
	// create the first flag as a freelancer flagging a client
	const id = random.guid(),
		client_id = random.guid(),
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, client_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancer, used in the tests below
	const client_first_name = random.name(),
		client_last_name = random.name(),
		flagging_client_first_name = random.name(),
		flagging_client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		flaggingClientData = { id: client_who_flagged, field_id, first_name: flagging_client_first_name, last_name: flagging_client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client(clientData);
		await random.client(flaggingClientData);
		await random.freelancer(freelancerData);
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
		it('should allow you to create a new flagged_client if given valid data with the flag being created by a freelancer (freelancer_who_flagged), create new created_at and updated_at fields, and return the new flagged_client object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id,
				flagged_client = await FlaggedClients.create(createData);

			checkFields(flagged_client, specificId, specificClientId);
		});

		it('should allow you to create a new flagged_client if given valid data with the flag being created by a client (client_who_flagged), create new created_at and updated_at fields, and return the new flagged_client object', async() => {
			const specificId = random.guid(),
				obj = { id: specificId, client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, data, obj),
				flagged_client = await FlaggedClients.create(createData);

			checkFields(flagged_client, specificId, client_id, client_who_flagged, null);
		});

		it('shouldn\'t allow a client to be flagged twice by the same freelancer and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificClientId = createData.client_id,
				flagged_client = await FlaggedClients.create(createData);

			checkFields(flagged_client, specificId, specificClientId);
			createData.id = secondId;

			try {
				await FlaggedClients.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_client');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer');
				expect(message).to.include('already flagged');
			}
		});

		it('shouldn\'t allow a client to be flagged twice by the same client and should raise an exception on the second attempt', async() => {
			const specificData = await createNewData(),
				specificId = specificData.id,
				secondId = random.guid(),
				specificClientId = specificData.client_id,
				obj = { client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, specificData, obj ),
				flagged_client = await FlaggedClients.create(createData);

			checkFields(flagged_client, specificId, specificClientId, client_who_flagged, null);
			createData.id = secondId;

			try {
				await FlaggedClients.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_client');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('client');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedClients, 'flagged_client', 'create', createData);
		});

		it('should require either freelancer_who_flagged or client_who_flagged and should raise an exception if given neither', async() => {
			const createData = await createNewData();
			createData.freelancer_who_flagged = null;

			return checkErr.checkNotNull(FlaggedClients, 'flagged_client', createData, 'freelancer_who_flagged and client_who_flagged');
		});

		it('should require a client_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedClients, 'flagged_client', createData, 'client_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedClients, 'flagged_client', createData, 'reason');
		});


		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedClients, 'flagged_client', 'create', createData, 'client_id', random.guid());
		});

		it('should raise an exception if given an incorrect freelancer_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedClients, 'flagged_client', 'create', createData, 'freelancer_who_flagged', random.guid());
		});

		it('should raise an exception if given an incorrect client_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();
			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;

			return checkErr.checkForeign(FlaggedClients, 'flagged_client', 'create', createData, 'client_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific flagged_client record with a given id, and return the object with relevant information about the client that was flagged, the freelancer who flagged it and all info about the client_who_flagged equal to null if it was flagged by a freelancer', async() => {
			const flagged_client = await FlaggedClients.findOne(id);

			expect(flagged_client).to.be.an.object();
			expect(flagged_client.id).to.equal(id);
			expect(flagged_client.client_id).to.equal(client_id);
			expect(flagged_client.client_first_name).to.equal(client_first_name);
			expect(flagged_client.client_last_name).to.equal(client_last_name);
			expect(flagged_client.client_who_flagged).to.equal(null);
			expect(flagged_client.flagging_client_first_name).to.equal(null);
			expect(flagged_client.flagging_client_last_name).to.equal(null);
			expect(flagged_client.freelancer_who_flagged).to.equal(freelancer_who_flagged);
			expect(flagged_client.flagging_freelancer_first_name).to.equal(freelancer_first_name);
			expect(flagged_client.flagging_freelancer_last_name).to.equal(freelancer_last_name);
			expect(flagged_client.reason).to.equal(reason);
			expect(flagged_client.created_at).to.be.a.date();
			expect(flagged_client.updated_at).to.equal(null);
		});

		it('should retrieve a specific flagged_client record with a given id, and return the object with relevant information about the client who flagged it and all info about the freelancer_who_flagged equal to null if it was flagged by a client', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id;
			createData.freelancer_who_flagged = null;
			createData.client_who_flagged = client_who_flagged;

			await random.flagged_client(createData);
			const flagged_client = await FlaggedClients.findOne(specificId);

			expect(flagged_client).to.be.an.object();
			expect(flagged_client.id).to.equal(specificId);
			expect(flagged_client.client_id).to.equal(specificClientId);
			expect(flagged_client.client_who_flagged).to.equal(client_who_flagged);
			expect(flagged_client.flagging_client_first_name).to.equal(flagging_client_first_name);
			expect(flagged_client.flagging_client_last_name).to.equal(flagging_client_last_name);
			expect(flagged_client.freelancer_who_flagged).to.equal(null);
			expect(flagged_client.flagging_freelancer_first_name).to.equal(null);
			expect(flagged_client.flagging_freelancer_last_name).to.equal(null);
			expect(flagged_client.reason).to.equal(reason);
			expect(flagged_client.created_at).to.be.a.date();
			expect(flagged_client.updated_at).to.equal(null);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedClients, 'flagged_client', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedClients, 'flagged_client', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_client = await random.flagged_client(createData);

			expect(flagged_client).to.be.an.object();
			expect(flagged_client.id).to.equal(specificId);

			const result = await FlaggedClients.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedClients, 'flagged_client', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedClients, 'flagged_client', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedClients, 'flagged_client', 'delete', {});
		});
	});


	describe('has cascading delete on client_id, client_who_flagged, and freelancer_who_flagged', () => {
		it('should be deleted in the event of the client who was flagged is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = createData.client_id,
				flagged_client = await random.flagged_client(createData);

			expect(flagged_client).to.be.an.object();
			expect(flagged_client.id).to.equal(specificId);
			expect(flagged_client.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedClients, 'flagged_client', 'find', specificId);
		});

		it('should be deleted in the event of the client who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;
			const flagged_client = await random.flagged_client(createData);

			expect(flagged_client).to.be.an.object();
			expect(flagged_client.id).to.equal(specificId);
			expect(flagged_client.client_who_flagged).to.equal(client_who_flagged);

			const result = await Clients.delete(client_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedClients, 'flagged_client', 'find', specificId);
		});

		it('should be deleted in the event of the freelancer who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_client = await random.flagged_client(createData);

			expect(flagged_client).to.be.an.object();
			expect(flagged_client.id).to.equal(specificId);
			expect(flagged_client.freelancer_who_flagged).to.equal(freelancer_who_flagged);

			const result = await Freelancers.delete(freelancer_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedClients, 'flagged_client', 'find', specificId);
		});
	});
});
