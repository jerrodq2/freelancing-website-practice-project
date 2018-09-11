'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Clients = require(`${process.cwd()}/src/services/users/models/clients`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Freelancer Reviews Model', () => {
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
		await random.freelancer_review(data);
	});

	// a simple function used to create the necessary id, and new job to create a new freelancer_review record
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

	// checks the basic fields of a freelancer_review object
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

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FreelancerReviews, 'freelancer_review', 'create', createData);
		});

		it('should require the rating to create', async() => {
			const createData = await createNewData();
			return checkErr.checkNotNull(FreelancerReviews, 'freelancer_review', createData, 'rating');
		});

		it('should require the review to create', async() => {
			const createData = await createNewData();
			return checkErr.checkNotNull(FreelancerReviews, 'freelancer_review', createData, 'review');
		});

		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();
			return checkErr.checkNotNull(FreelancerReviews, 'freelancer_review', createData, 'freelancer_id');
		});

		it('should require the client_id to create', async() => {
			const createData = await createNewData();
			return checkErr.checkNotNull(FreelancerReviews, 'freelancer_review', createData, 'client_id');
		});

		it('should require the job_id to create', async() => {
			const data = await createNewData(),
				createData = _.omit(data, 'job_id');

			// it goes through the Job model to first find the job, therefore gives a different error if we don't give it a job_id
			try {
				await FreelancerReviews.create(createData);
			} catch (err) {
				return checkErr.checkMessage(err, 'job', 'find', 'id', 'couldn\'t be completed', 'proper uuid format');
			}
		});

		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();
			return checkErr.checkForeign(FreelancerReviews, 'freelancer_review', 'create', createData, 'freelancer_id', random.guid());
		});

		it('should raise an exception if given an incorrect client_id (foreign key not found)', async() => {
			const createData = await createNewData();
			return checkErr.checkForeign(FreelancerReviews, 'freelancer_review', 'create', createData, 'client_id', random.guid());
		});

		it('should raise an exception if given an incorrect job_id (foreign key not found)', async() => {
			const createData = await createNewData();
			createData.job_id = random.guid();

			// it goes through the Job model to first find the job, therefore gives a different error if we give it a bad job_id
			try {
				await FreelancerReviews.create(createData);
			} catch (err) {
				return checkErr.checkMessage(err, 'job', 'find', 'id', 'does not exist', 'not found');
			}
		});

		it('shouldn\'t allow more than one freelancer_review per job, or it should raise an exception if the job_id isn\'t unique (unique field)', async() => {
			const createData = await createNewData();

			return checkErr.checkUnique(FreelancerReviews, 'freelancer_review', 'create', createData, 'job_id', job_id);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific freelancer_review with a given id, and return the object with relevant information about the client, freelancer, and job.', async() => {
			const review = await FreelancerReviews.findOne(id);

			// check the job fields first
			checkFields(review, id, job_id);
			// check the revelvant information about the three related records
			expect(review.freelancer_first_name).to.equal(freelancer_first_name);
			expect(review.freelancer_last_name).to.equal(freelancer_last_name);
			expect(review.client_first_name).to.equal(client_first_name);
			expect(review.client_last_name).to.equal(client_last_name);
			expect(review.job_title).to.equal(title);
			expect(review.job_rate).to.equal(rate);
			expect(review.job_rate_type).to.equal(rate_type);
			expect(review.job_description).to.equal(description);
			expect(review.job_experience_level_requested).to.equal(experience_level_requested);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FreelancerReviews, 'freelancer_review', 'find', {});
		});
	});


	describe('has an update method', () => {
		const new_rating = random.integer({ min: 0, max: 5 }),
			new_review = random.paragraph(),
			updateData = { rating: new_rating, review: new_review };

		it('should update the freelancer_review record if given a valid id and data, update the \'updated_at\' field, and return the updated object', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const oldReview = await FreelancerReviews.create(createData);
			expect(oldReview).to.be.an.object();
			expect(oldReview.id).to.equal(specificId);
			expect(oldReview.updated_at).to.equal(null);

			const updatedReview = await FreelancerReviews.update(specificId, updateData);

			expect(updatedReview).to.be.an.object();
			expect(updatedReview.id).to.equal(specificId);
			expect(updatedReview.rating).to.equal(new_rating);
			expect(updatedReview.review).to.equal(new_review);
			expect(updatedReview.updated_at).to.be.a.date();
		});

		it('should update the freelancer_review record if given a valid id and data, even if only given one field', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const oldReview = await FreelancerReviews.create(createData);
			expect(oldReview).to.be.an.object();
			expect(oldReview.id).to.equal(specificId);
			expect(oldReview.rating).to.equal(rating);
			expect(oldReview.updated_at).to.equal(null);

			const updatedReview = await FreelancerReviews.update(specificId, { rating: new_rating });

			expect(updatedReview).to.be.an.object();
			expect(updatedReview.id).to.equal(specificId);
			expect(updatedReview.rating).to.equal(new_rating);
			expect(updatedReview.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FreelancerReviews, 'freelancer_review', 'update', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;
			createData.id = specificId;
			await random.freelancer_review(createData);

			const review = await FreelancerReviews.findOne(specificId);
			expect(review).to.be.an.object();
			expect(review.id).to.equal(specificId);

			const result = await FreelancerReviews.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FreelancerReviews, 'freelancer_review', 'delete', {});
		});
	});


	describe('has cascading delete on job_id, client_id, and freelancer_id', () => {
		it('should be deleted in the event of the client who it is associated with is deleted', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificClientId = random.guid();
			createData.client_id = specificClientId;

			await random.client({ id: specificClientId, field_id });
			const review = await FreelancerReviews.create(createData);

			expect(review).to.be.an.object();
			expect(review.id).to.equal(specificId);
			expect(review.client_id).to.equal(specificClientId);

			const result = await Clients.delete(specificClientId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'find', specificId);
		});

		it('should be deleted in the event of the freelancer who it is associated with is deleted', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId, field_id });
			const review = await FreelancerReviews.create(createData);

			expect(review).to.be.an.object();
			expect(review.id).to.equal(specificId);
			expect(review.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'find', specificId);
		});

		it('should be deleted in the event of the job who it is associated with is deleted', async() => {
			const specificId = random.guid(),
				specificJobId = random.guid(),
				obj = { id: specificId, job_id: specificJobId },
				createData = Object.assign({}, data, obj);

			await random.job({ id: specificJobId, field_id, client_id, freelancer_id, closed: true, available: false });
			const review = await FreelancerReviews.create(createData);

			expect(review).to.be.an.object();
			expect(review.id).to.equal(specificId);
			expect(review.job_id).to.equal(specificJobId);

			const result = await Jobs.delete(specificJobId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerReviews, 'freelancer_review', 'find', specificId);
		});
	});
});
