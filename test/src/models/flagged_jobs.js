'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedJobs = require(`${process.cwd()}/src/models/flagged_jobs`);
const Clients = require(`${process.cwd()}/src/services/users/models/clients`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const Jobs = require(`${process.cwd()}/src/services/jobs/models/jobs`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Flagged Jobs Model', () => {
	// create the first flag as a freelancer flagging a job
	const id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(), // the client who creates any job that is flagged, saves us having to create a client for each one
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, job_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancer, used in the tests below
	const title = random.sentence(),
		description = random.paragraph(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		jobData = { id: job_id, client_id, field_id, title, description },

		clientData = { id: client_who_flagged, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.job(jobData);
		await random.client(clientData);
		await random.freelancer(freelancerData);
		await random.flagged_job(data);
	});


	// simple function that creates a new job that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			obj = { id: specificId, job_id: specificJobId },
			createData = Object.assign({}, data, obj);

		await random.job({ id: specificJobId, client_id, field_id });
		return createData;
	};

	// checks all fields in a given flagged_job object
	const checkFields = (obj, givenId, givenJobId = job_id, givenFlaggingClient = null, givenFlaggingFreelancer = freelancer_who_flagged) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.client_who_flagged).to.equal(givenFlaggingClient);
		expect(obj.freelancer_who_flagged).to.equal(givenFlaggingFreelancer);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};

	describe('has a create method', () => {
		it('should allow you to create a new flagged_job if given valid data with the flag being created by a freelancer (freelancer_who_flagged), create new created_at and updated_at fields, and return the new flagged_job object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				flagged_job = await FlaggedJobs.create(createData);

			checkFields(flagged_job, specificId, specificJobId);
		});

		it('should allow you to create a new flagged_job if given valid data with the flag being created by a client (client_who_flagged), create new created_at and updated_at fields, and return the new flagged_job object', async() => {
			const specificId = random.guid(),
				obj = { id: specificId, client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, data, obj),
				flagged_job = await FlaggedJobs.create(createData);

			checkFields(flagged_job, specificId, job_id, client_who_flagged, null);
		});

		it('shouldn\'t allow a job to be flagged twice by the same freelancer and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificJobId = createData.job_id,
				flagged_job = await FlaggedJobs.create(createData);

			checkFields(flagged_job, specificId, specificJobId);
			createData.id = secondId;

			try {
				await FlaggedJobs.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_job');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer');
				expect(message).to.include('already flagged');
			}
		});

		it('shouldn\'t allow a job to be flagged twice by the same client and should raise an exception on the second attempt', async() => {
			const specificData = await createNewData(),
				specificId = specificData.id,
				secondId = random.guid(),
				specificJobId = specificData.job_id,
				obj = { client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, specificData, obj ),
				flagged_job = await FlaggedJobs.create(createData);

			checkFields(flagged_job, specificId, specificJobId, client_who_flagged, null);
			createData.id = secondId;

			try {
				await FlaggedJobs.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_job');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('client');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedJobs, 'flagged_job', 'create', createData);
		});

		it('should require either freelancer_who_flagged or client_who_flagged and should raise an exception if given neither', async() => {
			const createData = await createNewData();
			createData.freelancer_who_flagged = null;

			return checkErr.checkNotNull(FlaggedJobs, 'flagged_job', createData, 'freelancer_who_flagged and client_who_flagged');
		});

		it('should require a job_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedJobs, 'flagged_job', createData, 'job_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedJobs, 'flagged_job', createData, 'reason');
		});


		it('should raise an exception if given an incorrect job_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedJobs, 'flagged_job', 'create', createData, 'job_id', random.guid());
		});

		it('should raise an exception if given an incorrect freelancer_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedJobs, 'flagged_job', 'create', createData, 'freelancer_who_flagged', random.guid());
		});

		it('should raise an exception if given an incorrect client_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();
			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;

			return checkErr.checkForeign(FlaggedJobs, 'flagged_job', 'create', createData, 'client_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific flagged_job record with a given id, and return the object with relevant information about the job that was flagged, the freelancer who flagged it and all info about the client_who_flagged equal to null if it was flagged by a freelancer', async() => {
			const flagged_job = await FlaggedJobs.findOne(id);

			expect(flagged_job).to.be.an.object();
			expect(flagged_job.id).to.equal(id);
			expect(flagged_job.job_id).to.equal(job_id);
			expect(flagged_job.job_title).to.equal(title);
			expect(flagged_job.job_description).to.equal(description);
			expect(flagged_job.client_who_flagged).to.equal(null);
			expect(flagged_job.flagging_client_first_name).to.equal(null);
			expect(flagged_job.flagging_client_last_name).to.equal(null);
			expect(flagged_job.freelancer_who_flagged).to.equal(freelancer_who_flagged);
			expect(flagged_job.flagging_freelancer_first_name).to.equal(freelancer_first_name);
			expect(flagged_job.flagging_freelancer_last_name).to.equal(freelancer_last_name);
			expect(flagged_job.reason).to.equal(reason);
			expect(flagged_job.created_at).to.be.a.date();
			expect(flagged_job.updated_at).to.equal(null);
		});

		it('should retrieve a specific flagged_job record with a given id, and return the object with relevant information about the client who flagged it and all info about the freelancer_who_flagged equal to null if it was flagged by a client', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id;
			createData.freelancer_who_flagged = null;
			createData.client_who_flagged = client_who_flagged;

			await random.flagged_job(createData);
			const flagged_job = await FlaggedJobs.findOne(specificId);

			expect(flagged_job).to.be.an.object();
			expect(flagged_job.id).to.equal(specificId);
			expect(flagged_job.job_id).to.equal(specificJobId);
			expect(flagged_job.client_who_flagged).to.equal(client_who_flagged);
			expect(flagged_job.flagging_client_first_name).to.equal(client_first_name);
			expect(flagged_job.flagging_client_last_name).to.equal(client_last_name);
			expect(flagged_job.freelancer_who_flagged).to.equal(null);
			expect(flagged_job.flagging_freelancer_first_name).to.equal(null);
			expect(flagged_job.flagging_freelancer_last_name).to.equal(null);
			expect(flagged_job.reason).to.equal(reason);
			expect(flagged_job.created_at).to.be.a.date();
			expect(flagged_job.updated_at).to.equal(null);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedJobs, 'flagged_job', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedJobs, 'flagged_job', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_job = await random.flagged_job(createData);

			expect(flagged_job).to.be.an.object();
			expect(flagged_job.id).to.equal(specificId);

			const result = await FlaggedJobs.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedJobs, 'flagged_job', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedJobs, 'flagged_job', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedJobs, 'flagged_job', 'delete', {});
		});
	});


	describe('has cascading delete on job_id, client_who_flagged, and freelancer_who_flagged', () => {
		it('should be deleted in the event of the job that was flagged is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				flagged_job = await random.flagged_job(createData);

			expect(flagged_job).to.be.an.object();
			expect(flagged_job.id).to.equal(specificId);
			expect(flagged_job.job_id).to.equal(specificJobId);

			const result = await Jobs.delete(specificJobId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedJobs, 'flagged_job', 'find', specificId);
		});

		it('should be deleted in the event of the freelancer who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_job = await random.flagged_job(createData);

			expect(flagged_job).to.be.an.object();
			expect(flagged_job.id).to.equal(specificId);
			expect(flagged_job.freelancer_who_flagged).to.equal(freelancer_who_flagged);

			const result = await Freelancers.delete(freelancer_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedJobs, 'flagged_job', 'find', specificId);
		});

		it('should be deleted in the event of the client who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;
			const flagged_job = await random.flagged_job(createData);

			expect(flagged_job).to.be.an.object();
			expect(flagged_job.id).to.equal(specificId);
			expect(flagged_job.client_who_flagged).to.equal(client_who_flagged);

			const result = await Clients.delete(client_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedJobs, 'flagged_job', 'find', specificId);
		});
	});
});
