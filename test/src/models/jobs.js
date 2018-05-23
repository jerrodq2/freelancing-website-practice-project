'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const { db, random } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Jobs Model', () => {
	const id = random.guid(),
		field_id = random.guid(),
		client_id = random.guid(),
		freelancer_id = random.guid(),
		title = random.word(),
		field = random.word(),
		rate = 5000,
		rate_type = 'flat',
		description = random.paragraph(),
		state = 'TX',
		city = random.word(),
		zip = random.zip(),
		onsite_required = false,
		available = true,
		closed = false,
		experience_level_requested = 'any',
		data = { id, field_id, client_id, freelancer_id, title, rate, rate_type, description, state, city, zip, onsite_required, available, closed, experience_level_requested };

	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id, field });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.job({ id }); // testing errors
		return random.job(data);
	});
	describe('has a create method', () => {
		it('should work...', async() => {
			expect(1).to.equal(1);
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});
});
