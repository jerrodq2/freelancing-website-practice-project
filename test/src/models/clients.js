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
		return random.client(data);
	});

	describe('has a create method', () => {
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

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});
});
