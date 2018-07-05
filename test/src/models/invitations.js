'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Invitations = require(`${process.cwd()}/src/models/invitations`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Invitations Model', () => {
	// roundDate is a simple function to round Javascript dates to the nearest day. When creating a new date with JS, it creates problems in the test, since the database rounds it to a day and saves it like that, so this eliminates that problem
	const today = new Date(),
		roundDate = (date) => {
			const offsetMs = date.getTimezoneOffset() * 60 * 1000, oneDayMs = 24 * 60 * 60 * 1000;
			return new Date(Math.floor((date.getTime() - offsetMs) / oneDayMs) * oneDayMs + offsetMs);
		};

	let requested_time_limit = new Date();
	// put the requested_time_limit to be two weeks from now
	requested_time_limit.setDate(today.getDate()+14);
	requested_time_limit = roundDate(requested_time_limit); // round it to be a day (no minutes, seconds, etc.), this is how it is saved in the db

	// These variables are used to create the invitation record
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(),
		title = random.word(),
		description = random.paragraph(),
		status = 'pending',
		data = { id, freelancer_id, job_id, client_id, title, description, requested_time_limit, status };

	// these variables are used to create the freelancer, client, and job, used in below tests for accuracy
	const field_id = random.guid(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		freelancer_job_title = random.word(),
		freelancer_experience_level = 'expert',
		client_first_name = random.name(),
		client_last_name = random.name(),
		job_title = random.word(),
		rate = random.integer({ min: 10, max: 100 }),
		rate_type = 'hourly',
		job_description = random.paragraph(),
		experience_level_requested = 'expert',

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name, job_title: freelancer_job_title, experience_level: freelancer_experience_level },

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		jobData = { id: job_id, title: job_title, rate, rate_type, description: job_description, experience_level_requested, client_id, freelancer_id, closed: 'false' };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.job(jobData);
		await random.invitation(data);
	});


	// creates an the new variables needed to create a new invitation record
	const createNewData = async() => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			specificFreelancerId = random.guid(),
			obj = { id: specificId, job_id: specificJobId, freelancer_id: specificFreelancerId },
			createData = Object.assign({}, data, obj);

		await random.freelancer({ id: specificFreelancerId, field_id });
		await random.job({ id: specificJobId, field_id, client_id, closed: 'false' });


		return createData;
	};

	// checks the basic fields in a given invitation object
	const checkFields = (obj, givenId, givenJobId = job_id, givenFreelancerId = freelancer_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(givenFreelancerId);
		expect(obj.client_id).to.equal(client_id);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.title).to.equal(title);
		expect(obj.description).to.equal(description);
		expect(obj.requested_time_limit).to.equal(requested_time_limit);
		expect(obj.status).to.equal(status);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};

	describe('has a create method', () => {
		it('should create a new invitation record if given valid data, create new created_at and udpated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				specificFreelancerId = createData.freelancer_id,
				invitation = await Invitations.create(createData);

			checkFields(invitation, specificId, specificJobId, specificFreelancerId);
		});

		it('should only allow you to create a new invitation if the job is still open and should raise an exception when you try to create it when the job is closed', async() => {
			const specificId = random.guid(),
				specificJobId = random.guid(),
				obj = { id: specificId, job_id: specificJobId },
				createData = Object.assign({}, data, obj);

			await random.job({ id: specificJobId, field_id, client_id, freelancer_id, closed: true });

			try {
				await Invitations.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('invitation');
				expect(message).to.include('trying to create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('this job is closed');
			}
		});

		it('should only allow a client to create one invitation per freelancer for the same job and raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				specificFreelancerId = createData.freelancer_id,
				secondId = random.guid(),
				invitation = await Invitations.create(createData);

			checkFields(invitation, specificId, specificJobId, specificFreelancerId);

			createData.id = secondId;
			try {
				await Invitations.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('invitation');
				expect(message).to.include('trying to create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('this client has already written an invitation to this freelancer for this job');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(Invitations, 'invitation', 'create', createData);
		});

		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Invitations, 'invitation', createData, 'freelancer_id');
		});

		it('should require the client_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Invitations, 'invitation', createData, 'client_id');
		});

		it('should require the job_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Invitations, 'invitation', createData, 'job_id');
		});

		it('should require the title to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Invitations, 'invitation', createData, 'title');
		});

		it('should require the description to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Invitations, 'invitation', createData, 'description');
		});

		it('should require the status to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Invitations, 'invitation', createData, 'status');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(Invitations, 'invitation', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(Invitations, 'invitation', 'create', createData, 'client_id', random.guid());
		});

		it('should raise an exception if given an incorrect job_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(Invitations, 'invitation', 'create', createData, 'job_id', random.guid());
		});
	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id, client_id, and job_id', () => {

	});
});
