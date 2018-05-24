'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const { db, random, _ } = require(`${process.cwd()}/test/src/helpers`);


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
		// const bad = await random.job({ id }) // testing errors
		// 	.catch((e) => {
		// 		console.log('e', e.message);
		// 	})
		return random.job(data);
	});
	describe('has a create method', () => {

		const checkFields = (job, givenId, freelancer) => {
			expect(job).to.be.an.object();
			expect(job.id).to.equal(givenId);
			expect(job.field_id).to.equal(field_id);
			expect(job.client_id).to.equal(client_id);
			expect(job.freelancer_id).to.equal(freelancer);
			expect(job.title).to.equal(title);
			expect(job.rate).to.equal(rate);
			expect(job.rate_type).to.equal(rate_type);
			expect(job.description).to.equal(description);
			expect(job.state).to.equal(state);
			expect(job.city).to.equal(city);
			expect(job.zip).to.equal(zip);
			expect(job.onsite_required).to.equal(onsite_required);
			expect(job.available).to.equal(available);
			expect(job.closed).to.equal(closed);
			expect(job.experience_level_requested).to.equal(experience_level_requested);
			expect(job.created_at).to.be.a.date();
			expect(job.updated_at).to.equal(null);
		};

		const checkError = async (field) => {
			const specificId = random.guid();
			let createData = Object.assign({}, data, { id: specificId });
			createData = _.omit(createData, field);

			try {
				await Jobs.create(createData);
			} catch (err) {
				expect(err.message).to.include('jobs');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include(field);
			}
		};

		it('should create a new job if given valid data, create new created_at and updated_at fields, and return the new job object', async() => {
			const specificId = random.guid(),
				createData = Object.assign({}, data, { id: specificId });

			const job = await Jobs.create(createData);
			return checkFields(job, specificId, freelancer_id);

		});

		it('should be able to create a job without a freelancer_id', async() => {
			const specificId = random.guid();
			let createData = Object.assign({}, data, { id: specificId });
			createData = _.omit(createData, 'freelancer_id');

			const job = await Jobs.create(createData);
			return checkFields(job, specificId, null);
		});

		it('should require the title to create', async() => {
			return checkError('title');
		});

		it('should require a field_id to create', async() => {
			return checkError('field_id');
		});

		it('should require a client_id to create', async() => {
			return checkError('client_id');
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});
});
