'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedJobs = require(`${process.cwd()}/src/models/saved_jobs`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Saved Jobs Model', () => {
	// data used to create the saved_job
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		data = { id, freelancer_id, job_id };

	// data used to create the freelancer and job, used in tests below
	const field_id = random.guid(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		title = random.word(),
		rate = random.integer({ min: 10, max: 100 }),
		rate_type = 'hourly',
		description = random.paragraph(),
		experience_level_requested = 'expert',

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name },

		jobData = { id: job_id, field_id, title, rate, rate_type, description, experience_level_requested };


	before(async() => {
		// clearing these two tables will clear saved_jobs via cascading delete
		await db.resetTable('freelancers');
		await db.resetTable('jobs');
		await db.resetTable('clients');
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.job(jobData);
		await random.saved_job(data);
	});


	// creates the necessary fields to create a new saved_job record. Needs a new job for each record
	const createNewData = async() => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			obj = { id: specificId, job_id: specificJobId };

		await random.job({ id: specificJobId, field_id });

		const createData = Object.assign({}, data, obj);
		return createData;
	};

	// checks all fields in a given saved_job record
	const checkFields = (obj, givenId, givenJobId = job_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new saved_job record if given valid data, create new created_at and updated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				saved_job = await SavedJobs.create(createData);

			checkFields(saved_job, specificId, specificJobId);
		});

		it('should only allow a freelancer to save a job once, and raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				secondId = random.guid(),
				saved_job = await SavedJobs.create(createData);

			checkFields(saved_job, specificId, specificJobId);

			createData.id = secondId;
			try {
				await SavedJobs.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('saved_job');
				expect(message).to.include('trying to create can\'t be completed');
				expect(message).to.include('already saved the job');
				expect(message).to.include(specificJobId);
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(SavedJobs, 'saved_job', 'create', createData);
		});


		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(SavedJobs, 'saved_job', createData, 'freelancer_id');
		});

		it('should require the job_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(SavedJobs, 'saved_job', createData, 'job_id');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(SavedJobs, 'saved_job', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect job_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(SavedJobs, 'saved_job', 'create', createData, 'job_id', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific saved_job with a given id, and return the object with relevant information about the job and freelancer', async() => {
			const saved_job = await SavedJobs.findOne(id);

			// first check the fields that belong to the saved_client record
			checkFields(saved_job, id);

			expect(saved_job.freelancer_first_name).to.equal(freelancer_first_name);
			expect(saved_job.freelancer_last_name).to.equal(freelancer_last_name);
			expect(saved_job.job_title).to.equal(title);
			expect(saved_job.job_rate).to.equal(rate);
			expect(saved_job.job_rate_type).to.equal(rate_type);
			expect(saved_job.job_description).to.equal(description);
			expect(saved_job.job_experience_level_requested).to.equal(experience_level_requested);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(SavedJobs, 'saved_job', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(SavedJobs, 'saved_job', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const saved_job = await random.saved_job(createData);
			expect(saved_job).to.be.an.object();
			expect(saved_job.id).to.equal(specificId);

			const result = await SavedJobs.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(SavedJobs, 'saved_job', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(SavedJobs, 'saved_job', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(SavedJobs, 'saved_job', 'delete', {});
		});
	});


	describe('has cascading delete on freelancer_id and job_id', () => {
		it('should be deleted in the event of the freelancer who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			const saved_job = await SavedJobs.create(createData);

			expect(saved_job).to.be.an.object();
			expect(saved_job.id).to.equal(specificId);
			expect(saved_job.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(SavedJobs, 'saved_job', 'find', specificId);
		});

		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id;

			const saved_job = await SavedJobs.create(createData);

			expect(saved_job).to.be.an.object();
			expect(saved_job.id).to.equal(specificId);
			expect(saved_job.job_id).to.equal(specificJobId);

			const result = await Jobs.delete(specificJobId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(SavedJobs, 'saved_job', 'find', specificId);
		});
	});
});
