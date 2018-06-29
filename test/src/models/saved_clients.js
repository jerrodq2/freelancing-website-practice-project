'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedClients = require(`${process.cwd()}/src/models/saved_clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Saved Clients Model', () => {
	const id = random.guid(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		field_id = random.guid(),
		data = { id, freelancer_id, client_id };

	before(async() => {
		// clearing these two tables will clear saved_clients via cascading delete
		await db.resetTable('clients');
		await db.resetTable('freelancers');

		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client({ id: client_id, field_id });
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
		it('should create a new saved_client record if given valid data, create new updated_at and updated_at fields, and return the new object', async() => {
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

	});


	describe('has an update method', () => {

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
	});


	describe('has cascading delete on freelancer_id and client_id', () => {

	});
});
