'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Invitations = require(`${process.cwd()}/src/services/invitations_and_proposals/models/invitations`);
const Jobs = require(`${process.cwd()}/src/services/jobs/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const Clients = require(`${process.cwd()}/src/services/users/models/clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Invitations Model', () => {
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
			obj = { id: specificId, job_id: specificJobId },
			createData = Object.assign({}, data, obj);

		await random.job({ id: specificJobId, field_id, client_id, closed: 'false' });


		return createData;
	};

	// checks the basic fields in a given invitation object
	const checkFields = (obj, givenId, givenJobId = job_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
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


	describe('has a findOne method', () => {
		it('should retrieve a specific invitation with a given id, and return the object with relevant information about the client, freelancer, and job', async() => {
			const invitation = await Invitations.findOne(id);

			// first check the fields that belong to the invitation record
			checkFields(invitation, id);

			expect(invitation.freelancer_first_name).to.equal(freelancer_first_name);
			expect(invitation.freelancer_last_name).to.equal(freelancer_last_name);
			expect(invitation.freelancer_job_title).to.equal(freelancer_job_title);
			expect(invitation.freelancer_experience_level).to.equal(freelancer_experience_level);
			expect(invitation.client_first_name).to.equal(client_first_name);
			expect(invitation.client_last_name).to.equal(client_last_name);
			expect(invitation.job_title).to.equal(job_title);
			expect(invitation.job_rate).to.equal(rate);
			expect(invitation.job_rate_type).to.equal(rate_type);
			expect(invitation.job_description).to.equal(job_description);
			expect(invitation.job_experience_level_requested).to.equal(experience_level_requested);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Invitations, 'invitation', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Invitations, 'invitation', 'find', {});
		});
	});


	describe('has an update method', () => {
		let new_requested_time_limit = new Date();
		// put the new_requested_time_limit to be one week from now
		new_requested_time_limit.setDate(today.getDate()+7);
		new_requested_time_limit = roundDate(new_requested_time_limit);

		const new_title = random.word(),
			new_description = random.paragraph(),
			new_status = 'pending',
			updateData = { title: new_title, description: new_description, status: new_status, requested_time_limit: new_requested_time_limit };

		it('should update the invitation if given a valid id and data, update the updated_at field, and return the updated object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				invitation = await random.invitation(createData);

			checkFields(invitation, specificId, specificJobId);

			const updatedInvitation = await Invitations.update(specificId, updateData);

			expect(updatedInvitation).to.be.an.object();
			expect(updatedInvitation.id).to.equal(specificId);
			expect(updatedInvitation.freelancer_id).to.equal(freelancer_id);
			expect(updatedInvitation.client_id).to.equal(client_id);
			expect(updatedInvitation.job_id).to.equal(specificJobId);
			expect(updatedInvitation.title).to.equal(new_title);
			expect(updatedInvitation.description).to.equal(new_description);
			expect(updatedInvitation.requested_time_limit).to.equal(new_requested_time_limit);
			expect(updatedInvitation.status).to.equal(new_status);
			expect(updatedInvitation.created_at).to.be.a.date();
			expect(updatedInvitation.updated_at).to.be.a.date();
		});

		it('should update the invitation record if given a valid id and data, even if only given one field', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				invitation = await random.invitation(createData);

			checkFields(invitation, specificId, specificJobId);

			const updatedInvitation = await Invitations.update(specificId, { title: new_title });

			expect(updatedInvitation).to.be.an.object();
			expect(updatedInvitation.id).to.equal(specificId);
			expect(updatedInvitation.job_id).to.equal(specificJobId);
			expect(updatedInvitation.title).to.equal(new_title);
			expect(updatedInvitation.created_at).to.be.a.date();
			expect(updatedInvitation.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Invitations, 'invitation', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Invitations, 'invitation', 'update', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const invitation = await random.invitation(createData);
			expect(invitation).to.be.an.object();
			expect(invitation.id).to.equal(specificId);

			const result = await Invitations.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Invitations, 'invitation', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Invitations, 'invitation', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Invitations, 'invitation', 'delete', {});
		});
	});


	describe('has cascading delete on freelancer_id, client_id, and job_id', () => {
		it('should be deleted in the event of the freelancer who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			const invitation = await random.invitation(createData);

			expect(invitation).to.be.an.object();
			expect(invitation.id).to.equal(specificId);
			expect(invitation.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Invitations, 'invitation', 'find', specificId);
		});

		it('should be deleted in the event of the client who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = random.guid();
			createData.client_id = specificClientId;

			await random.client({ id: specificClientId, field_id });
			const invitation = await random.invitation(createData);

			expect(invitation).to.be.an.object();
			expect(invitation.id).to.equal(specificId);
			expect(invitation.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Invitations, 'invitation', 'find', specificId);
		});

		it('should be deleted in the event of the job who created it is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id;

			const invitation = await random.invitation(createData);

			expect(invitation).to.be.an.object();
			expect(invitation.id).to.equal(specificId);
			expect(invitation.job_id).to.equal(specificJobId);

			const result = await Jobs.delete(specificJobId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Invitations, 'invitation', 'find', specificId);
		});
	});
});
