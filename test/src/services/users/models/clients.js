'use strict';


// This file tests the clients src model. It tests what should work, how it should work, and what should cause errors
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Clients = require(`${process.cwd()}/src/services/users/models/clients`);
const { db, random, knex, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Clients Model', () => {
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


	// simple function used to create the necessary unique variables to create a new client and add it to the above data object
	const createNewData = () => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,

			obj = { id: specificId, username: specificUsername, email: specificEmail },
			createData = Object.assign({}, data, obj);

		return createData;
	};

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


	describe('has a create method', async() => {
		const createData = createNewData(),
			specificId = createData.id,
			specificEmail = createData.email,
			specificUsername = createData.username;
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
			const createData = createNewData();
			createData.id = 1;
			return checkErr.checkIdFormat(Clients, 'client', 'create', createData);
		});

		// check that certain fields are required to create
		it('should require a first_name to create', async() => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'first_name');
		});

		it('should require a last_name to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'last_name');
		});

		it('should require a username to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'username');
		});

		it('should require a email to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'email');
		});

		it('should require a gender to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'gender');
		});

		it('should require a age to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'age');
		});

		it('should require a field_id to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'field_id');
		});

		it('should require a password to create', () => {
			return checkErr.checkNotNull(Clients, 'client', createNewData(), 'password');
		});

		it('should default active to \'true\' if not given', async () => {
			const data = createNewData(),
				specificId = data.id;
			const createData = _.omit(data, field);

			const client = await Clients.create(createData);

			expect(client).to.be.an.object();
			expect(client.id).to.equal(specificId);
			expect(client.active).to.equal(true);
		});

		// check that certain fields have to be unique to create
		it('should raise an exception if the username isn\'t unique (unique field)', () => {
			return checkErr.checkUnique(Clients, 'client', 'create', createNewData(), 'username', username);
		});
		it('should raise an exception if the email isn\'t unique (unique field)', () => {
			return checkErr.checkUnique(Clients, 'client', 'create', createNewData(), 'email', email);
		});

		// check that the field_id must belong to an actual field in the db
		it('should raise an exception if given an incorrect field_id (foreign key not found)', () => {
			return checkErr.checkForeign(Clients, 'client', 'create', createNewData(), 'field_id', random.guid());
		});
	});


	// I don't re-test all of the errors test above here because the createWithoutHash method still goes through the create method to actually create the record. This is to speed up tests and not be overly tedious
	describe('has a createWithoutHash method used for testing that doesn\'t hash the given password,', async() => {
		const createData = createNewData(),
			specificId = createData.id,
			specificEmail = createData.email,
			specificUsername = createData.username;
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

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Clients, 'client', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Clients, 'client', 'find', {});
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
			newDob = random.date({ string: true }),
			active = false,
			specificId = random.guid(); // used in below checkUnique error tests

		let updateData = { field_id: newFieldId, first_name: newFirstName, last_name: newLastName, gender: newGender, age: newAge, summary: newSummary, state: newState, city: newCity, zip: newZip, phone: newPhone, dob: newDob, active };


		before(async() => {
			await random.field({ id: newFieldId });
			return random.client({ id: specificId, field_id });
		});

		it('should update the client record if given a valid id and data, and return the updated object without password or username', async() => {
			const createData = createNewData(),
				specificId = createData.id,
				specificEmail = createData.email,
				newEmail = `update-${specificEmail}`;
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
			expect(updatedClient.active).to.equal(false);
			expect(updatedClient.email).to.equal(newEmail);
			expect(updatedClient.updated_at).to.be.a.date();
			expect(updatedClient.username).to.equal(undefined);
			expect(updatedClient.password).to.equal(undefined);
		});

		it('should update the client record with the given id if given valid data, even if only given one field', async() => {
			const createData = createNewData(),
				specificId = createData.id,
				specificEmail = createData.email;
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

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Clients, 'client', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Clients, 'client', 'update', {});
		});

		it('should raise an exception if the username isn\'t unique (unique field)', () => {
			return checkErr.checkUnique(Clients, 'client', 'update', createNewData(), 'username', username, specificId);
		});

		it('should raise an exception if the email isn\'t unique (unique field)', () => {
			return checkErr.checkUnique(Clients, 'client', 'update', createNewData(), 'email', email, specificId);
		});

		it('should raise an exception if given an incorrect field_id (foreign key not found)', () => {
			return checkErr.checkForeign(Clients, 'client', 'update', updateData, 'field_id', random.guid(), id);
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id', async() => {
			const specificId = random.guid();
			await random.client({ id: specificId, field_id });

			const client = await Clients.findOne(specificId);
			expect(client).to.be.an.object();
			expect(client.id).to.equal(specificId);

			const afterDelete = await Clients.delete(specificId);
			expect(afterDelete).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Clients, 'client', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Clients, 'client', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Clients, 'client', 'delete', {});
		});
	});
});
