'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const JobActivity = require(`${process.cwd()}/src/models/job_activity`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const Clients = require(`${process.cwd()}/src/services/users/models/clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Job Activity Model', () => {
	// These variables are used to create the job_activity record
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(),
		data = { id, freelancer_id, job_id, client_id };

	// these variables are used to create the freelancer, client, and job, used in below tests for accuracy
	const field_id = random.guid(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		title = random.word(),
		rate = random.integer({ min: 10, max: 100 }),
		rate_type = 'hourly',
		description = random.paragraph(),
		experience_level_requested = 'expert',

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name },

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		jobData = { id: job_id, title, rate, rate_type, description, experience_level_requested, client_id, freelancer_id };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.job(jobData);
		await random.job_activity(data);
	});


	// creates an the new variables needed to create a new job_activity record
	const createNewData = async() => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			obj = { id: specificId, job_id: specificJobId },
			createData = Object.assign({}, data, obj);

		await random.job({ id: specificJobId, field_id, client_id, freelancer_id });

		return createData;
	};

	// checks the basic fields in a given job_activity object
	const checkFields = (obj, givenId, givenJobId = job_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.client_id).to.equal(client_id);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};

	describe('has a create method', () => {
		it('should create a new job_activity record if given valid data, create new created_at and udpated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				activity = await JobActivity.create(createData);

			checkFields(activity, specificId, specificJobId);
		});

		it('should only allow a freelancer to have a job_activity with a specific job_id created once, and raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				secondId = random.guid(),
				activity = await JobActivity.create(createData);

			checkFields(activity, specificId, specificJobId);

			createData.id = secondId;
			try {
				await JobActivity.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('job_activity');
				expect(message).to.include('trying to create can\'t be completed');
				expect(message).to.include('already saved the job');
				expect(message).to.include(specificJobId);
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(JobActivity, 'job_activity', 'create', createData);
		});

		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(JobActivity, 'job_activity', createData, 'freelancer_id');
		});

		it('should require the client_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(JobActivity, 'job_activity', createData, 'client_id');
		});

		it('should require the job_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(JobActivity, 'job_activity', createData, 'job_id');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(JobActivity, 'job_activity', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(JobActivity, 'job_activity', 'create', createData, 'client_id', random.guid());
		});

		it('should raise an exception if given an incorrect job_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(JobActivity, 'job_activity', 'create', createData, 'job_id', random.guid());
		});
	});


	describe('has a getAll method', () => {
		it('should retrieve all of the job_activity records with the given freelancer_id and return them as an array of objects', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			await random.job_activity(createData); //so we can test the first record
			await random.job_activities(10, { freelancer_id: specificFreelancerId, client_id });

			const activities = await JobActivity.getAll(specificFreelancerId);

			expect(activities).to.be.an.array();
			expect(activities.length).to.equal(11);

			const record = activities[0];
			expect(record).to.be.an.object();
			expect(record.id).to.equal(specificId);
			expect(record.client_id).to.equal(client_id);
			expect(record.freelancer_id).to.equal(specificFreelancerId);
			expect(record.job_id).to.equal(specificJobId);
		});

		it('should return an empty array if the given freelancer_id has no records for it\'s job_acitivty', async() => {
			const specificFreelancerId = random.guid(),
				activities = await JobActivity.getAll(specificFreelancerId);

			expect(activities).to.be.an.array();
			expect(activities.length).to.equal(0);
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(JobActivity, 'job_activity', 'getAll', {});
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific job_activity with a given id, and return the object with relevant information about the client, freelancer, and job', async() => {
			const activity = await JobActivity.findOne(id);

			// first check the fields that belong to the job_activity record
			checkFields(activity, id);

			expect(activity.freelancer_first_name).to.equal(freelancer_first_name);
			expect(activity.freelancer_last_name).to.equal(freelancer_last_name);
			expect(activity.client_first_name).to.equal(client_first_name);
			expect(activity.client_last_name).to.equal(client_last_name);
			expect(activity.job_title).to.equal(title);
			expect(activity.job_rate).to.equal(rate);
			expect(activity.job_rate_type).to.equal(rate_type);
			expect(activity.job_description).to.equal(description);
			expect(activity.job_experience_level_requested).to.equal(experience_level_requested);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(JobActivity, 'job_activity', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(JobActivity, 'job_activity', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const activity = await random.job_activity(createData);
			expect(activity).to.be.an.object();
			expect(activity.id).to.equal(specificId);

			const result = await JobActivity.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(JobActivity, 'job_activity', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(JobActivity, 'job_activity', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(JobActivity, 'job_activity', 'delete', {});
		});
	});


	describe('has cascading delete on job_id, freelancer_id, and client_id', () => {
		it('should be deleted in the event of the freelancer who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			const activity = await JobActivity.create(createData);

			expect(activity).to.be.an.object();
			expect(activity.id).to.equal(specificId);
			expect(activity.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(JobActivity, 'job_activity', 'find', specificId);
		});

		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = random.guid();
			createData.client_id = specificClientId;

			await random.client({ id: specificClientId, field_id });
			const activity = await JobActivity.create(createData);

			expect(activity).to.be.an.object();
			expect(activity.id).to.equal(specificId);
			expect(activity.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(JobActivity, 'job_activity', 'find', specificId);
		});

		it('should be deleted in the event of the job who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id;

			const activity = await JobActivity.create(createData);

			expect(activity).to.be.an.object();
			expect(activity.id).to.equal(specificId);
			expect(activity.job_id).to.equal(specificJobId);

			const result = await Jobs.delete(specificJobId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(JobActivity, 'job_activity', 'find', specificId);
		});
	});
});
