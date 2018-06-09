'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Jobs Model', () => {
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


	// creates an object with a new id needed to create a new job record, conditionally removes the freelancer_id
	const createNewData = (remove = false) => {
		const specificId = random.guid();
		let createData = Object.assign({}, data, { id: specificId });

		if (remove) createData = _.omit(createData, 'freelancer_id');

		return createData;
	};

	// checks all fields in a given job, conditionally checks the freelancer_id to test a being created without one
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
		// checks that certain fields default to a certain value upon create if not given in the createData object
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
			const createData = createNewData(),
				specificId = createData.id;

			const job = await Jobs.create(createData);
			return checkFields(job, specificId);
		});

		it('should be able to create a job without a freelancer_id', async() => {
			const createData = createNewData(true),
				specificId = createData.id;

			const job = await Jobs.create(createData);
			checkFields(job, specificId, false);
			expect(job.freelancer_id).to.equal(null);
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			return checkErr.checkIdFormat(Jobs, 'job', 'create', createNewData());
		});


		it('should require the title to create', () => {
			return checkErr.checkNotNull(Jobs, 'job', createNewData(), 'title');
		});

		it('should require a field_id to create', () => {
			return checkErr.checkNotNull(Jobs, 'job', createNewData(), 'field_id');
		});

		it('should require a client_id to create', () => {
			return checkErr.checkNotNull(Jobs, 'job', createNewData(), 'client_id');
		});

		it('should require a rate to create', () => {
			return checkErr.checkNotNull(Jobs, 'job', createNewData(), 'rate');
		});

		it('should require a description to create', () => {
			return checkErr.checkNotNull(Jobs, 'job', createNewData(), 'description');
		});


		it('should raise an exception if given an incorrect client_id (foreign key not found)', () => {
			return checkErr.checkForeign(Jobs, 'job', 'create', createNewData(), 'client_id', random.guid());
		});

		it('should raise an exception if given an incorrect field_id (foreign key not found)', () => {
			return checkErr.checkForeign(Jobs, 'job', 'create', createNewData(), 'field_id', random.guid());
		});


		it('should default rate_type to \'hourly\' if not given', () => {
			return checkDefault('rate_type', 'hourly');
		});

		it('should default onsite_required to \'false\' if not given', () => {
			return checkDefault('onsite_required', false);
		});

		it('should default available to \'true\' if not given', () => {
			return checkDefault('available', true);
		});

		it('should default closed to \'false\' if not given', () => {
			return checkDefault('closed', false);
		});

		it('should default experience_level_requested to \'any\' if not given', () => {
			return checkDefault('experience_level_requested', 'any');
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific job with a given id, and return the object with relevant information about the client, freelancer, and field', async() => {
			const job = await Jobs.findOne(id);

			// first check the fields that belong to the job record
			checkFields(job, id);

			expect(job.field).to.equal(field);
			expect(job.client_first_name).to.equal(client_first_name);
			expect(job.client_last_name).to.equal(client_last_name);
			expect(job.freelancer_first_name).to.equal(freelancer_first_name);
			expect(job.freelancer_last_name).to.equal(freelancer_last_name);
			expect(job.freelancer_job_title).to.equal(freelancer_job_title);
			expect(job.freelancer_experience_level).to.equal(freelancer_experience_level);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Jobs, 'job', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Jobs, 'job', 'find', {});
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
			const createData = createNewData(),
				specificId = createData.id;

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
			const createData = createNewData(),
				specificId = createData.id,
				specificTitle = random.word();

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

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Jobs, 'job', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Jobs, 'job', 'update', {});
		});

		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', () => {
			return checkErr.checkForeign(Jobs, 'job', 'update', updateData, 'freelancer_id', random.guid(), id);
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', () => {
			return checkErr.checkForeign(Jobs, 'job', 'update', updateData, 'client_id', random.guid(), id);
		});

		it('should raise an exception if given an incorrect field_id (foreign key not found)', () => {
			return checkErr.checkForeign(Jobs, 'job', 'update', updateData, 'field_id', random.guid(), id);
		});
	});


	describe('has a delete method', () => {
		const createData = createNewData();

		it('should delete the record if given a correct id and return true if successful', async() => {
			const specificId = random.guid();
			createData.id = specificId;
			await random.job(createData);

			const job = await Jobs.findOne(specificId);
			expect(job).to.be.an.object();
			expect(job.id).to.equal(specificId);

			const result = await Jobs.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Jobs, 'job', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Jobs, 'job', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Jobs, 'job', 'delete', {});
		});
	});

	describe('has a client_id with \'cascade\' onDelete,', () => {
		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = createNewData(),
				specificId = random.guid(),
				specificClientId = random.guid();
			createData.id = specificId;
			createData.client_id = specificClientId;

			await random.client({ id: specificClientId, field_id });
			const job = await Jobs.create(createData);

			expect(job).to.be.an.object();
			expect(job.id).to.equal(specificId);
			expect(job.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Jobs, 'job', 'find', specificId);
		});
	});
});
