'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Client Reviews Model', () => {
	// variables used to create the review
	const id = random.guid(),
		rating = random.integer({ min: 1, max: 5 }),
		review = random.paragraph(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		job_id = random.guid(),
		field_id = random.guid(),
		data = { id, rating, review, freelancer_id, client_id, job_id };

	// variables used to create the three needed records, client, freelancer, and job
	const freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		title = random.word(),
		rate = 40,
		rate_type = 'hourly',
		description = random.paragraph(),
		experience_level_requested = 'any',

		freelancerData = { id: freelancer_id, first_name: freelancer_first_name, last_name: freelancer_last_name, field_id },

		clientData = { id: client_id, first_name: client_first_name, last_name: client_last_name, field_id },

		jobData = { id: job_id, field_id, client_id, freelancer_id, title, rate, rate_type, description, experience_level_requested, closed: true, available: false };

	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.job(jobData);
		await random.client_review(data);
		await random.client_reviews();
	});

	// a simple function used to create the necessary id, and new job to create a new client_review record
	const createNewData = async(closedStatus = true) => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			// sets available to be the opposite of closed, meaning false if closed is true and vice versa
			availableStatus = closedStatus? false : true,
			obj = { id: specificId, job_id: specificJobId },

			createData = Object.assign({}, data, obj);

		await random.job({ id: specificJobId, field_id, client_id, freelancer_id, closed: closedStatus, available: availableStatus });
		return createData;
	};

	// checks the basic fields of a client_review object
	const checkFields = (obj, givenId, givenJobId) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.rating).to.equal(rating);
		expect(obj.review).to.equal(review);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.client_id).to.equal(client_id);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new client_review record if given valid data, the job is complete, and a review hasn\'t already been written about this job. It should also create new created_at and updated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				review = await ClientReviews.create(createData);

			checkFields(review, specificId, specificJobId);
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_id, and freelancer_id', () => {

	});
});
