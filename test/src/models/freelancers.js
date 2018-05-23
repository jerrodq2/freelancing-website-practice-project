'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);


describe('Freelancers Model', () => {
	const id = random.guid(),
		first_name = random.name(),
		last_name = random.name(),
		username = 'username',
		email = 'freelancer@email.com',
		job_title = random.word(),
		rate = 15,
		experience_level = 'entry',
		video_url = null,
		portfolio_url = null,
		available = true,
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
		data = { id, first_name, last_name, username, email, job_title, rate, experience_level, video_url, portfolio_url, available, gender, age, field_id, summary, state, city, zip, phone, dob, password };


	before(async() => {
		await db.resetTable('fields');
		await db.resetTable('freelancers');
		await random.field({ id: field_id, field });
		return random.freelancer(data);
	});


	describe('has a create method', () => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			createData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });
		let record, freelancer, result;

		before(async() => {
			result = await Freelancers.create(createData);
			record = await knex('freelancers').where({ id: specificId });
			freelancer = record[0];
		});

		it('should create a new freelancer record if given valid data, create new created_at and updated_at fields, and return the freelancer object without the username or password', async() => {
			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);
			expect(result.email).to.equal(specificEmail);
			expect(result.job_title).to.equal(job_title);
			expect(result.rate).to.equal(rate);
			expect(result.experience_level).to.equal(experience_level);
			expect(result.video_url).to.equal(video_url);
			expect(result.portfolio_url).to.equal(portfolio_url);
			expect(result.available).to.equal(available);
			expect(result.gender).to.equal(gender);
			expect(result.age).to.equal(age);
			expect(result.field_id).to.equal(field_id);
			expect(result.summary).to.equal(summary);
			expect(result.state).to.equal(state);
			expect(result.city).to.equal(city);
			expect(result.zip).to.equal(zip);
			expect(result.phone).to.equal(phone);
			expect(result.dob).to.equal(new Date(dob));
			expect(result.created_at).to.be.a.date();
			expect(result.updated_at).to.equal(null);
			expect(result.username).to.equal(undefined);
			expect(result.password).to.equal(undefined);
		});

		it('should create the new record with the given username and the hashed password', async() => {
			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(specificId);
			expect(freelancer.username).to.equal(specificUsername);
			expect(freelancer.password).to.be.a.string();
			expect(freelancer.password).to.not.equal(password);
			expect(freelancer.password.length).to.be.above(password.length);
		});
	});


	describe('has a createWithoutHash method used for testing that doesn\'t hash the given password,', () => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			createData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });
		let record, freelancer, result;

		before(async() => {
			result = await Freelancers.createWithoutHash(createData);
			record = await knex('freelancers').where({ id: specificId });
			freelancer = record[0];
		});

		it('should create a new freelancer record if given valid data, create new created_at and updated_at fields, and return the client object without the username or password', async() => {
			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);
			expect(result.email).to.equal(specificEmail);
			expect(result.job_title).to.equal(job_title);
			expect(result.rate).to.equal(rate);
			expect(result.experience_level).to.equal(experience_level);
			expect(result.video_url).to.equal(video_url);
			expect(result.portfolio_url).to.equal(portfolio_url);
			expect(result.available).to.equal(available);
			expect(result.gender).to.equal(gender);
			expect(result.age).to.equal(age);
			expect(result.field_id).to.equal(field_id);
			expect(result.summary).to.equal(summary);
			expect(result.state).to.equal(state);
			expect(result.city).to.equal(city);
			expect(result.zip).to.equal(zip);
			expect(result.phone).to.equal(phone);
			expect(result.dob).to.equal(new Date(dob));
			expect(result.created_at).to.be.a.date();
			expect(result.updated_at).to.equal(null);
			expect(result.username).to.equal(undefined);
			expect(result.password).to.equal(undefined);
		});

		it('should create the new record with the given username and the plain password', async() => {
			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(specificId);
			expect(freelancer.username).to.equal(specificUsername);
			expect(freelancer.password).to.equal(password);
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});
});
