'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);


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

	describe('has a create method', async() => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			createData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });
		let result, client;

		before(async() => {
			await Clients.create(createData);
			result = await knex('clients').where({ id: specificId });
			client = result[0];
		});

		it('should create a new client record if given valid data', async() => {
			expect(client).to.be.an.object();
			expect(client.id).to.equal(specificId);
			expect(client.username).to.equal(specificUsername);
			expect(client.email).to.equal(specificEmail);
			expect(client.gender).to.equal(gender);
			expect(client.age).to.equal(age);
			expect(client.field_id).to.equal(field_id);
			expect(client.summary).to.equal(summary);
			expect(client.state).to.equal(state);
			expect(client.city).to.equal(city);
			expect(client.zip).to.equal(zip);
			expect(client.phone).to.equal(phone);
			expect(client.dob).to.equal(new Date(dob));
		});

		it('should create the new record with a hashed password, and new created_at and updated_at fields', async() => {
			expect(client.created_at).to.be.a.date();
			expect(client.updated_at).to.equal(null);
			expect(client.password).to.be.a.string();
			expect(client.password).to.not.equal(password);
			expect(client.password.length).to.be.above(password.length);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific client record without the password, username, or field_id, but it should have the name of the field.', async() => {
			const client = await Clients.findOne(id);

			expect(client).to.be.an.object();
			expect(client.id).to.equal(id);
			expect(client.email).to.equal(email);
			expect(client.gender).to.equal(gender);
			expect(client.age).to.equal(age);
			expect(client.field).to.equal(field);
			expect(client.summary).to.equal(summary);
			expect(client.state).to.equal(state);
			expect(client.city).to.equal(city);
			expect(client.zip).to.equal(zip);
			expect(client.phone).to.equal(phone);
			expect(client.dob).to.equal(new Date(dob));
			expect(client.username).to.equal(undefined);
			expect(client.password).to.equal(undefined);
			expect(client.field_id).to.equal(undefined);
		});
	});


	describe('has an update method', () => {
		const newFieldId = random.guid(),
			newFieldName = 'new field',
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


		before(() => random.field({ id: newFieldId, field: newFieldName }));

		it('should update the admin record if given a valid id and data', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				newEmail = `update-${specificEmail}`,
				createData = { id: specificId, email: specificEmail, field_id: field_id };
			updateData = Object.assign(updateData, { email: newEmail });

			await random.client(createData);
			const oldClient = await Clients.findOne(specificId);

			expect(oldClient).to.be.an.object();
			expect(oldClient.id).to.equal(specificId);
			expect(oldClient.email).to.equal(specificEmail);
			expect(oldClient.updated_at).to.equal(null);

			await Clients.update(specificId, updateData);
			const updatedClient = await Clients.findOne(specificId);

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
		});

		it('should update the client record with the given id if given valid data, even if only given one field', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				createData = { id: specificId, email: specificEmail, field_id: field_id };
			updateData = { first_name: newFirstName };

			await random.client(createData);
			const oldClient = await Clients.findOne(specificId);

			expect(oldClient).to.be.an.object();
			expect(oldClient.id).to.equal(specificId);
			expect(oldClient.email).to.equal(specificEmail);
			expect(oldClient.updated_at).to.equal(null);

			await Clients.update(specificId, updateData);
			const updatedClient = await Clients.findOne(specificId);

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
			expect(afterDelete.id).to.equal(undefined);
		});
	});
});
