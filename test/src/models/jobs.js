'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const { db, random, _ } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Jobs Model', () => {
	// info used to create first job
	const id = random.guid(),
		field_id = random.guid(),
		client_id = random.guid(),
		freelancer_id = random.guid(),
		title = random.word(),
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

	// info for other tables
	const field = random.word(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		freelancer_job_title = random.word(),
		freelancer_experience_level = 'entry',
		fieldData = { id: field_id, field },

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name, job_title: freelancer_job_title, experience_level: freelancer_experience_level };


	// checks all fields in a job, conditionally checks the freelancer_id to test a being created without one
	const checkFields = (job, givenId, checkFreelancer = true) => {
		expect(job).to.be.an.object();
		expect(job.id).to.equal(givenId);
		expect(job.field_id).to.equal(field_id);
		expect(job.client_id).to.equal(client_id);
		if (checkFreelancer)
			expect(job.freelancer_id).to.equal(freelancer_id);

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


	before(async() => {
		await db.resetAll();
		await random.field(fieldData);
		await random.client(clientData);
		await random.freelancer(freelancerData);
		return random.job(data);
	});


	describe('has a create method', () => {

		// checks that certain fields are required upon create
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

		// checks that fields default to a certain value upon create if not given
		const checkDefault = async (field, defaultValue) => {
			const specificId = random.guid();
			let createData = Object.assign({}, data, { id: specificId });
			createData = _.omit(createData, field);
			const job = await Jobs.create(createData);

			expect(job).to.be.an.object();
			expect(job.id).to.equal(specificId);
			expect(job[`${field}`]).to.equal(defaultValue);
		};


		it('should create a new job if given valid data, create new created_at and updated_at fields, and return the new job object', async() => {
			const specificId = random.guid(),
				createData = Object.assign({}, data, { id: specificId });

			const job = await Jobs.create(createData);
			return checkFields(job, specificId);
		});

		it('should be able to create a job without a freelancer_id', async() => {
			const specificId = random.guid();
			let createData = Object.assign({}, data, { id: specificId });
			createData = _.omit(createData, 'freelancer_id');

			const job = await Jobs.create(createData);
			checkFields(job, specificId, false);
			expect(job.freelancer_id).to.equal(null);
		});

		it('should require a id in proper uuid format', async() => {
			const specificId = 1,
				createData = Object.assign({}, data, { id: specificId });

			try {
				await Jobs.create(createData);
			} catch (err) {
				expect(err.message).to.include('jobs');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
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

		it('should require a rate to create', async() => {
			return checkError('rate');
		});

		it('should require a description to create', async() => {
			return checkError('description');
		});


		it('should default rate_type to \'hourly\' if not given', async() => {
			return checkDefault('rate_type', 'hourly');
		});

		it('should default onsite_required to \'false\' if not given', async() => {
			return checkDefault('onsite_required', false);
		});

		it('should default available to \'true\' if not given', async() => {
			return checkDefault('available', true);
		});

		it('should default closed to \'false\' if not given', async() => {
			return checkDefault('closed', false);
		});

		it('should default experience_level_requested to \'any\' if not given', async() => {
			return checkDefault('experience_level_requested', 'any');
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific job with a given id, and return the object with relevant information the client, freelancer, and field', async() => {
			const job = await Jobs.findOne(id);

			// first check the fields that belong to the job record.
			checkFields(job, id);

			expect(job.field).to.equal(field);
			expect(job.client_first_name).to.equal(client_first_name);
			expect(job.client_last_name).to.equal(client_last_name);
			expect(job.freelancer_first_name).to.equal(freelancer_first_name);
			expect(job.freelancer_last_name).to.equal(freelancer_last_name);
			expect(job.freelancer_job_title).to.equal(freelancer_job_title);
			expect(job.freelancer_experience_level).to.equal(freelancer_experience_level);
		});

		it('should return an empty object if not found or given an incorrect id', async() => {
			const job = await Jobs.findOne(random.guid());

			expect(job).to.be.an.object();
			expect(job).to.equal({});

		});

		it('should raise exception when given an invalid id (not in uuid format)', async() => {
			try {
				await Jobs.findOne(1);
			} catch (err) {
				expect(err.message).to.include('jobs');
				expect(err.message).to.include('findOne');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});
	});


	describe('has an update method', () => {
		const new_field_id = random.guid(),
			new_client_id = random.guid(),
			new_freelancer_id = random.guid(),
			new_title = random.word(),
			new_rate = 30,
			new_rate_type = 'hourly',
			new_description = random.paragraph(),
			new_state = 'FL',
			new_city = random.word(),
			new_zip = random.zip(),
			new_onsite_required = true,
			new_available = false,
			new_closed = true,
			new_experience_level_requested = 'expert',
			updateData = {
				field_id: new_field_id,
				client_id: new_client_id,
				freelancer_id: new_freelancer_id,
				title: new_title,
				rate: new_rate,
				rate_type: new_rate_type,
				description: new_description,
				state: new_state,
				city: new_city,
				zip: new_zip,
				onsite_required: new_onsite_required,
				available: new_available,
				closed: new_closed,
				experience_level_requested: new_experience_level_requested };

		before(async() => {
			await random.field({ id: new_field_id });
			await random.client({ id: new_client_id, field_id: new_field_id });
			await random.freelancer({ id: new_freelancer_id, field_id: new_field_id });
		});

		it('should update the job record if given a valid id and data, update the \'updated_at\' field, and return the updated job object', async() => {
			const specificId = random.guid(),
				createData = Object.assign({}, data, { id: specificId });

			const oldJob = await Jobs.create(createData);
			expect(oldJob).to.be.an.object();
			expect(oldJob.id).to.equal(specificId);
			expect(oldJob.updated_at).to.equal(null);

			const updatedJob = await Jobs.update(specificId, updateData);

			expect(updatedJob).to.be.an.object();
			expect(updatedJob.id).to.equal(specificId);
			expect(updatedJob.field_id).to.equal(new_field_id);
			expect(updatedJob.client_id).to.equal(new_client_id);
			expect(updatedJob.freelancer_id).to.equal(new_freelancer_id);
			expect(updatedJob.title).to.equal(new_title);
			expect(updatedJob.rate).to.equal(new_rate);
			expect(updatedJob.rate_type).to.equal(new_rate_type);
			expect(updatedJob.description).to.equal(new_description);
			expect(updatedJob.state).to.equal(new_state);
			expect(updatedJob.city).to.equal(new_city);
			expect(updatedJob.zip).to.equal(new_zip);
			expect(updatedJob.onsite_required).to.equal(new_onsite_required);
			expect(updatedJob.available).to.equal(new_available);
			expect(updatedJob.closed).to.equal(new_closed);
			expect(updatedJob.experience_level_requested).to.equal(new_experience_level_requested);
			expect(updatedJob.updated_at).to.be.a.date();
		});

		it('should update the job record if given a valid id and data, even if only given one field ', async() => {
			const specificId = random.guid(),
				specificTitle = random.word(),
				createData = Object.assign({}, data, { id: specificId });

			const oldJob = await Jobs.create(createData);
			expect(oldJob).to.be.an.object();
			expect(oldJob.id).to.equal(specificId);
			expect(oldJob.updated_at).to.equal(null);

			const updatedJob = await Jobs.update(specificId, { title: specificTitle });

			expect(updatedJob).to.be.an.object();
			expect(updatedJob.id).to.equal(specificId);
			expect(updatedJob.title).to.equal(specificTitle);
			expect(updatedJob.updated_at).to.be.a.date();
		});

		it('should return an empty object if given an incorrect id (not found)', async() => {
			const job = await Jobs.update(random.guid(), {});
			expect(job).to.be.an.object();
			expect(job).to.equal({});
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			try {
				await Jobs.update(1, {});
			} catch (err) {
				expect(err.message).to.include('jobs');
				expect(err.message).to.include('update');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}

		});
	});


	describe('has a delete method', () => {

	});
});
