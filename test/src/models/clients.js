'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, knex, _ } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Clients Model', () => {
	const id = random.guid(),
		first_name = random.name(),
		last_name = random.name(),
		username = 'username',
		email = 'client@email.com',
		gender = 'female',
		age = 49,
		field_id = random.guid(),
		field = random.word(),
		summary = random.paragraph(),
		state = 'NY',
		city = random.word(),
		zip = random.zip(),
		phone = random.phone(),
		dob = random.date({ string: true }),
		password = random.word(),
		data = { id, first_name, last_name, username, email, gender, age, field_id, summary, state, city, zip, phone, dob, password };

	before(async() => {
		await db.resetTable('clients');
		await db.resetTable('fields');
		await random.field({ id: field_id, field });
		return random.client(data);
	});


	// checks all fields returned from the create or createWithoutHash method
	const checkFields = (obj, givenId, givenEmail, checkField = true) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.first_name).to.equal(first_name);
		expect(obj.last_name).to.equal(last_name);
		expect(obj.email).to.equal(givenEmail);
		expect(obj.gender).to.equal(gender);
		expect(obj.age).to.equal(age);
		if (checkField) {
			expect(obj.field_id).to.equal(field_id);
		} else {
			// this is checked in the findOne
			expect(obj.field_id).to.equal(undefined);
		}
		expect(obj.summary).to.equal(summary);
		expect(obj.state).to.equal(state);
		expect(obj.city).to.equal(city);
		expect(obj.zip).to.equal(zip);
		expect(obj.phone).to.equal(phone);
		expect(obj.dob).to.equal(new Date(dob));
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
		expect(obj.username).to.equal(undefined);
		expect(obj.password).to.equal(undefined);
	};

	// checks the error message for the below methods, just putting re-used code in its own function for DRYness
	const checkError = (err, givenField, expectedError) => {
		expect(err.message).to.include('client');
		expect(err.message).to.include('create');
		expect(err.message).to.include('couldn\'t be completed');
		expect(err.message).to.include(expectedError);
		expect(err.message).to.include(`'${givenField}'`);
	};

	// check that certain fields are required upon create
	const checkNotNull = async(givenField) => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			obj = { id: specificId, username: specificUsername, email: specificEmail },
			newData = Object.assign({}, data, obj),
			createData = _.omit(newData, field);

		try {
			await Clients.create(createData);
		} catch (err) {
			return checkError(err, givenField, 'violated the not-null constraint');
		}
	};

	// checks that certain fields have to be unique to create
	const checkUnique = async(givenField) => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			obj = { id: specificId, username: specificUsername, email: specificEmail },
			createData = Object.assign({}, data, obj);
		createData[`${givenField}`] = givenField;

		try {
			await Clients.create(createData);
		} catch (err) {
			return checkError(err, givenField, 'violated the unique constraint');
		}
	};

	// checks that foreign key fields require a correct id to create
	const checkForeign = async(givenField) => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			obj = { id: specificId, username: specificUsername, email: specificEmail },
			createData = Object.assign({}, data, obj);
		createData[`${givenField}`] = random.guid();

		try {
			await Clients.create(createData);
		} catch (err) {
			return checkError(err, givenField, 'violated the foreign key constraint');
		}
	};


	describe('has a create method', async() => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			createData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });
		let record, client, result;

		before(async() => {
			result = await Clients.create(createData);
			record = await knex('clients').where({ id: specificId });
			client = record[0];
		});

		it('should create a new client record if given valid data, create new created_at and updated_at fields, and return the client object without the username or password', async() => {
			return checkFields(result, specificId, specificEmail);
		});

		it('should create the new record with the given username and the hashed password', async() => {
			expect(client).to.be.an.object();
			expect(client.id).to.equal(specificId);
			expect(client.username).to.equal(specificUsername);
			expect(client.password).to.be.a.string();
			expect(client.password).to.not.equal(password);
			expect(client.password.length).to.be.above(password.length);
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = Object.assign({}, data, { id: 1, username: random.word(), email: random.email() });

			try {
				await Clients.create(createData);
			} catch (err) {
				expect(err.message).to.include('client');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});

		// check that certain fields are required to create
		it('should require a first_name to create', () => checkNotNull('first_name'));
		it('should require a last_name to create', () => checkNotNull('last_name'));
		it('should require a username to create', () => checkNotNull('username'));
		it('should require a email to create', () => checkNotNull('email'));
		it('should require a gender to create', () => checkNotNull('gender'));
		it('should require a age to create', () => checkNotNull('age'));
		it('should require a field_id to create', () => checkNotNull('field_id'));

		// check that certain fields have to be unique to create
		it('should raise an exception if the username isn\'t unique (unique field)', () => checkUnique('username'));
		it('should raise an exception if the email isn\'t unique (unique field)', () => checkUnique('email'));

		// check that certain fields have to be unique to create
		it('should raise an exception if given an incorrect field_id (foreign key not found)', () => checkForeign('field_id'));
	});


	// I don't test all of the error test above here because the createWithoutHash method still goes through the create method to actually create the record. This is to speed up tests and not be tedious
	describe('has a createWithoutHash method used for testing that doesn\'t hash the given password,', async() => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			createData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });
		let record, client, result;

		before(async() => {
			result = await Clients.createWithoutHash(createData);
			record = await knex('clients').where({ id: specificId });
			client = record[0];
		});

		it('should create a new client record if given valid data, create new created_at and updated_at fields, and return the client object without the username or password', async() => {
			return checkFields(result, specificId, specificEmail);
		});

		it('should create the new record with the given username and the plain password', async() => {
			expect(client).to.be.an.object();
			expect(client.id).to.equal(specificId);
			expect(client.username).to.equal(specificUsername);
			expect(client.password).to.equal(password);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific client with a given id, and return an object without the password, username, or field_id, but with the name of the field', async() => {
			const client = await Clients.findOne(id);

			// check the usual fields first
			checkFields(client, id, email, false);
			expect(client.field).to.equal(field);
		});

		it('should return an empty object if not found or given an incorrect id', async() => {
			const client = await Clients.findOne(random.guid());

			expect(client).to.be.an.object();
			expect(client).to.equal({});
		});
	});


	describe('has an update method', () => {
		const newFieldId = random.guid(),
			newFirstName = random.name(),
			newLastName = random.name(),
			newGender = 'male',
			newAge = 22,
			newSummary = random.paragraph(),
			newState = 'FL',
			newCity = random.word(),
			newZip = random.zip(),
			newPhone = random.phone(),
			newDob = random.date({ string: true });

		let updateData = { field_id: newFieldId, first_name: newFirstName, last_name: newLastName, gender: newGender, age: newAge, summary: newSummary, state: newState, city: newCity, zip: newZip, phone: newPhone, dob: newDob };


		before(() => random.field({ id: newFieldId }));

		it('should update the client record if given a valid id and data, and return the updated object without password or username', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				newEmail = `update-${specificEmail}`,
				createData = { id: specificId, email: specificEmail, field_id };
			updateData = Object.assign(updateData, { email: newEmail });

			await random.client(createData);
			const oldClient = await Clients.findOne(specificId);

			expect(oldClient).to.be.an.object();
			expect(oldClient.id).to.equal(specificId);
			expect(oldClient.email).to.equal(specificEmail);
			expect(oldClient.updated_at).to.equal(null);

			const updatedClient = await Clients.update(specificId, updateData);

			expect(updatedClient).to.be.an.object();
			expect(updatedClient.id).to.equal(specificId);
			expect(updatedClient.first_name).to.equal(newFirstName);
			expect(updatedClient.last_name).to.equal(newLastName);
			expect(updatedClient.gender).to.equal(newGender);
			expect(updatedClient.age).to.equal(newAge);
			expect(updatedClient.summary).to.equal(newSummary);
			expect(updatedClient.state).to.equal(newState);
			expect(updatedClient.city).to.equal(newCity);
			expect(updatedClient.zip).to.equal(newZip);
			expect(updatedClient.phone).to.equal(newPhone);
			expect(updatedClient.dob).to.equal(new Date(newDob));
			expect(updatedClient.email).to.equal(newEmail);
			expect(updatedClient.updated_at).to.be.a.date();
			expect(updatedClient.username).to.equal(undefined);
			expect(updatedClient.password).to.equal(undefined);
		});

		it('should update the client record with the given id if given valid data, even if only given one field', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				createData = { id: specificId, email: specificEmail, field_id };
			updateData = { first_name: newFirstName };

			await random.client(createData);
			const oldClient = await Clients.findOne(specificId);

			expect(oldClient).to.be.an.object();
			expect(oldClient.id).to.equal(specificId);
			expect(oldClient.email).to.equal(specificEmail);
			expect(oldClient.updated_at).to.equal(null);

			const updatedClient = await Clients.update(specificId, updateData);

			expect(updatedClient).to.be.an.object();
			expect(updatedClient.id).to.equal(specificId);
			expect(updatedClient.first_name).to.equal(newFirstName);
			expect(updatedClient.updated_at).to.be.a.date();


		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id', async() => {
			const specificId = random.guid();
			await random.client({ id: specificId, field_id });

			const client = await Clients.findOne(specificId);
			expect(client).to.be.an.object();
			expect(client.id).to.equal(specificId);

			await Clients.delete(specificId);
			const afterDelete = await Clients.findOne(specificId);

			expect(afterDelete).to.be.an.object();
			expect(afterDelete).to.equal({});
		});
	});
});
