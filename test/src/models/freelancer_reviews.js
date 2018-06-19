'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);
const { db, random, knex, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Freelancer Reviews Model', () => {
	const id = random.guid(),
		rating = random.integer({ min: 0, max: 5 }),
		review = random.paragraph(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		job_id = random.guid(),
		field_id = random.guid(),
		data = { id, rating, review, freelancer_id, client_id, job_id };

	before(async() => {
		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client({ id: client_id, field_id });
		await random.job({ id: job_id, field_id, client_id, freelancer_id, closed: true, available: false });
		await random.freelancer_review(data);
	});

	// a simple function used to create the necessary id, and new job to create a new freelancer_review record
	const createNewData = async(closedStatus = true) => {
		const specificId = random.guid(),
			specificJobId = random.guid(),
			availableStatus = closedStatus? false : true,
			obj = { id: specificId, job_id: specificJobId },
			createData = Object.assign({}, data, obj);

		await random.job({ id: specificJobId, field_id, client_id, freelancer_id, closed: closedStatus, available: availableStatus });
		return createData;
	};

	// checks the basic fields of a freelancer_review object
	const checkFields = (obj, givenId, givenJobId, givenFreelancerId = freelancer_id, givenClientId = client_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.rating).to.equal(rating);
		expect(obj.review).to.equal(review);
		expect(obj.job_id).to.equal(givenJobId);
		expect(obj.freelancer_id).to.equal(givenFreelancerId);
		expect(obj.client_id).to.equal(givenClientId);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new freelancer_review record if given valid data, the job is complete, and a review hasn\'t already been written about this job. It should also create new created_at and updated_at fields, and return the new object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificJobId = createData.job_id,
				review = await FreelancerReviews.create(createData);

			checkFields(review, specificId, specificJobId);
		});

		it('shouldn\'t be able to create a freelancer_review for a job that isn\'t completed/closed yet', async() => {
			const createData = await createNewData(false);

			try {
				await FreelancerReviews.create(createData);
			} catch (err) {
				expect(err.message).to.be.a.string();
				expect(err.message).to.include('freelancer_review');
				expect(err.message).to.include('hasn\'t been completed');
			}
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
});
