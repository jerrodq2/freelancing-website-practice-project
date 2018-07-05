'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Proposals = require(`${process.cwd()}/src/models/proposals`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Proposals Model', () => {
	// simple function to round Javascript dates to the nearest date. When creating a new date with JS, it creates problems in the test, since the database rounds it to a day and saves it like that, so this eliminates that problem
	const roundDate = (date) => {
		const offsetMs = date.getTimezoneOffset() * 60 * 1000, oneDayMs = 24 * 60 * 60 * 1000;
		return new Date(Math.floor((date.getTime() - offsetMs) / oneDayMs) * oneDayMs + offsetMs);
	};

	// These variables are used to create the proposal record
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(),
		title = random.word(),
		description = random.paragraph(),
		status = 'pending',
		today = new Date();

	let estimated_time_limit = new Date();
	// put the estimated_time_limit to be two weeks from now
	estimated_time_limit.setDate(today.getDate()+14);
	estimated_time_limit = roundDate(estimated_time_limit); // round it to be a day (no minutes, seconds, etc.), this is how it is saved in the db

	const data = { id, freelancer_id, job_id, client_id, title, description, estimated_time_limit, status };

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
		await random.proposal(data);
	});


	// creates an the new variables needed to create a new proposal record
	const createNewData = async() => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			obj = { id: specificId, job_id: specificJobId },
			createData = Object.assign({}, data, obj);

		await random.job({ id: specificJobId, field_id, client_id, freelancer_id, closed: 'false' });

		return createData;
	};

	// checks the basic fields in a given proposal object
	const checkFields = (obj, givenId, givenJobId = job_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.client_id).to.equal(client_id);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.title).to.equal(title);
		expect(obj.description).to.equal(description);
		expect(obj.estimated_time_limit).to.equal(estimated_time_limit);
		expect(obj.status).to.equal(status);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new job_activity record if given valid data, create new created_at and udpated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				proposal = await Proposals.create(createData);

			checkFields(proposal, specificId, specificJobId);
		});

		it('should only allow you to create a new proposal if the job is still open and should raise an exception when you try to create it when the job is closed', async() => {
			const specificId = random.guid(),
				specificJobId = random.guid(),
				obj = { id: specificId, job_id: specificJobId },
				createData = Object.assign({}, data, obj);

			await random.job({ id: specificJobId, field_id, client_id, freelancer_id, closed: true });

			try {
				await Proposals.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('proposal');
				expect(message).to.include('trying to create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('this job is closed');
			}
		});

		it('should only allow a freelancer to create one proposal per job and raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				secondId = random.guid(),
				proposal = await Proposals.create(createData);

			checkFields(proposal, specificId, specificJobId);

			createData.id = secondId;
			try {
				await Proposals.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('proposal');
				expect(message).to.include('trying to create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer has already written a proposal for this job');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(Proposals, 'proposal', 'create', createData);
		});

		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Proposals, 'proposal', createData, 'freelancer_id');
		});

		it('should require the client_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Proposals, 'proposal', createData, 'client_id');
		});

		it('should require the job_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Proposals, 'proposal', createData, 'job_id');
		});

		it('should require the title to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Proposals, 'proposal', createData, 'title');
		});

		it('should require the description to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Proposals, 'proposal', createData, 'description');
		});

		it('should require the status to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(Proposals, 'proposal', createData, 'status');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(Proposals, 'proposal', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(Proposals, 'proposal', 'create', createData, 'client_id', random.guid());
		});

		it('should raise an exception if given an incorrect job_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(Proposals, 'proposal', 'create', createData, 'job_id', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific proposal with a given id, and return the object with relevant information about the client, freelancer, and job', async() => {
			const proposal = await Proposals.findOne(id);

			// first check the fields that belong to the job_activity record
			checkFields(proposal, id);

			expect(proposal.freelancer_first_name).to.equal(freelancer_first_name);
			expect(proposal.freelancer_last_name).to.equal(freelancer_last_name);
			expect(proposal.freelancer_job_title).to.equal(freelancer_job_title);
			expect(proposal.freelancer_experience_level).to.equal(freelancer_experience_level);
			expect(proposal.client_first_name).to.equal(client_first_name);
			expect(proposal.client_last_name).to.equal(client_last_name);
			expect(proposal.job_title).to.equal(job_title);
			expect(proposal.job_rate).to.equal(rate);
			expect(proposal.job_rate_type).to.equal(rate_type);
			expect(proposal.job_description).to.equal(job_description);
			expect(proposal.job_experience_level_requested).to.equal(experience_level_requested);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Proposals, 'proposal', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Proposals, 'proposal', 'find', {});
		});
	});


	describe('has an update method', () => {
		let new_estimated_time_limit = new Date();
		// put the estimated_time_limit to be one week from now
		new_estimated_time_limit.setDate(today.getDate()+7);
		new_estimated_time_limit = roundDate(new_estimated_time_limit);

		const new_title = random.word(),
			new_description = random.paragraph(),
			new_status = 'pending',
			updateData = { title: new_title, description: new_description, status: new_status, estimated_time_limit: new_estimated_time_limit };

		it('should update the proposal if given a valid id and data, update the updated_at field, and return the updated object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				proposal = await random.proposal(createData);

			checkFields(proposal, specificId, specificJobId);

			const updatedProposal = await Proposals.update(specificId, updateData);

			expect(updatedProposal).to.be.an.object();
			expect(updatedProposal.id).to.equal(specificId);
			expect(updatedProposal.freelancer_id).to.equal(freelancer_id);
			expect(updatedProposal.client_id).to.equal(client_id);
			expect(updatedProposal.job_id).to.equal(specificJobId);
			expect(updatedProposal.title).to.equal(new_title);
			expect(updatedProposal.description).to.equal(new_description);
			expect(updatedProposal.estimated_time_limit).to.equal(new_estimated_time_limit);
			expect(updatedProposal.status).to.equal(new_status);
			expect(updatedProposal.created_at).to.be.a.date();
			expect(updatedProposal.updated_at).to.be.a.date();
		});

		it('should update the proposal record if given a valid id and data, even if only given one field', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				proposal = await random.proposal(createData);

			checkFields(proposal, specificId, specificJobId);

			const updatedProposal = await Proposals.update(specificId, { title: new_title });

			expect(updatedProposal).to.be.an.object();
			expect(updatedProposal.id).to.equal(specificId);
			expect(updatedProposal.job_id).to.equal(specificJobId);
			expect(updatedProposal.title).to.equal(new_title);
			expect(updatedProposal.created_at).to.be.a.date();
			expect(updatedProposal.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Proposals, 'proposal', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Proposals, 'proposal', 'update', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const proposal = await random.proposal(createData);
			expect(proposal).to.be.an.object();
			expect(proposal.id).to.equal(specificId);

			const result = await Proposals.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Proposals, 'proposal', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Proposals, 'proposal', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Proposals, 'proposal', 'delete', {});
		});
	});


	describe('has cascading delete on freelancer_id, client_id, and job_id', () => {
		it('should be deleted in the event of the freelancer who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			const proposal = await random.proposal(createData);

			expect(proposal).to.be.an.object();
			expect(proposal.id).to.equal(specificId);
			expect(proposal.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Proposals, 'proposal', 'find', specificId);
		});

		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = random.guid();
			createData.client_id = specificClientId;

			await random.client({ id: specificClientId, field_id });
			const proposal = await random.proposal(createData);

			expect(proposal).to.be.an.object();
			expect(proposal.id).to.equal(specificId);
			expect(proposal.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Proposals, 'proposal', 'find', specificId);
		});

		it('should be deleted in the event of the job who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id;

			const proposal = await random.proposal(createData);

			expect(proposal).to.be.an.object();
			expect(proposal.id).to.equal(specificId);
			expect(proposal.job_id).to.equal(specificJobId);

			const result = await Jobs.delete(specificJobId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Proposals, 'proposal', 'find', specificId);
		});
	});
});
