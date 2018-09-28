'use strict';


// This file tests the flagged_freelancer_reviews src model. It tests what should work, how it should work, and what should cause errors
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedFreelancerReviews = require(`${process.cwd()}/src/services/flags/models/flagged_freelancer_reviews`);
const Clients = require(`${process.cwd()}/src/services/users/models/clients`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const FreelancerReviews = require(`${process.cwd()}/src/services/reviews/models/freelancer_reviews`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Flagged Freelancer Reviews Model', () => {
	// create the first flag as a freelancer flagging a freelancer_review
	const id = random.guid(),
		freelancer_review_id = random.guid(),
		client_id = random.guid(), // the client that writes the review, saves us having to create a client for each one
		freelancer_id = random.guid(), // the freelancer that each review will be about, saves us having to create a freelancer for each one
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, freelancer_review_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancers, used in the tests below
	const review = random.sentence(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		reviewData = { id: freelancer_review_id, client_id, freelancer_id, review },

		clientData = { id: client_who_flagged, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.freelancer_review(reviewData);
		await random.client(clientData);
		await random.freelancer(freelancerData);
		await random.flagged_freelancer_review(data);
	});


	// simple function that creates a new freelancer_review that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificReviewId = random.guid(),
			obj = { id: specificId, freelancer_review_id: specificReviewId },
			createData = Object.assign({}, data, obj);

		await random.freelancer_review({ id: specificReviewId, client_id, field_id });
		return createData;
	};

	// checks all fields in a given flagged_freelancer_review object
	const checkFields = (obj, givenId, givenReviewId = freelancer_review_id, givenFlaggingClient = null, givenFlaggingFreelancer = freelancer_who_flagged) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_review_id).to.equal(givenReviewId);
		expect(obj.client_who_flagged).to.equal(givenFlaggingClient);
		expect(obj.freelancer_who_flagged).to.equal(givenFlaggingFreelancer);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};

	describe('has a create method', () => {
		it('should allow you to create a new flagged_freelancer_review if given valid data with the flag being created by a freelancer (freelancer_who_flagged), create new created_at and updated_at fields, and return the new flagged_freelancer_review object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificReviewId = createData.freelancer_review_id,
				flagged_review = await FlaggedFreelancerReviews.create(createData);

			checkFields(flagged_review, specificId, specificReviewId);
		});

		it('should allow you to create a new flagged_freelancer_review if given valid data with the flag being created by a client (client_who_flagged), create new created_at and updated_at fields, and return the new flagged_freelancer_review object', async() => {
			const specificId = random.guid(),
				obj = { id: specificId, client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, data, obj),
				flagged_review = await FlaggedFreelancerReviews.create(createData);

			checkFields(flagged_review, specificId, freelancer_review_id, client_who_flagged, null);
		});

		it('shouldn\'t allow a freelancer_review to be flagged twice by the same freelancer and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificReviewId = createData.freelancer_review_id,
				flagged_review = await FlaggedFreelancerReviews.create(createData);

			checkFields(flagged_review, specificId, specificReviewId);
			createData.id = secondId;

			try {
				await FlaggedFreelancerReviews.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_freelancer_review');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer');
				expect(message).to.include('already flagged');
			}
		});

		it('shouldn\'t allow a freelancer_review to be flagged twice by the same client and should raise an exception on the second attempt', async() => {
			const specificData = await createNewData(),
				specificId = specificData.id,
				secondId = random.guid(),
				specificReviewId = specificData.freelancer_review_id,
				obj = { client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, specificData, obj ),
				flagged_review = await FlaggedFreelancerReviews.create(createData);

			checkFields(flagged_review, specificId, specificReviewId, client_who_flagged, null);
			createData.id = secondId;

			try {
				await FlaggedFreelancerReviews.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_freelancer_review');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('client');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'create', createData);
		});

		it('should require either freelancer_who_flagged or client_who_flagged and should raise an exception if given neither', async() => {
			const createData = await createNewData();
			createData.freelancer_who_flagged = null;

			return checkErr.checkNotNull(FlaggedFreelancerReviews, 'flagged_freelancer_review', createData, 'freelancer_who_flagged and client_who_flagged');
		});

		it('should require a freelancer_review_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedFreelancerReviews, 'flagged_freelancer_review', createData, 'freelancer_review_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedFreelancerReviews, 'flagged_freelancer_review', createData, 'reason');
		});


		it('should raise an exception if given an incorrect freelancer_review_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'create', createData, 'freelancer_review_id', random.guid());
		});

		it('should raise an exception if given an incorrect freelancer_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'create', createData, 'freelancer_who_flagged', random.guid());
		});

		it('should raise an exception if given an incorrect client_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();
			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;

			return checkErr.checkForeign(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'create', createData, 'client_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific flagged_freelancer_review record with a given id, and return the object with relevant information about the freelancer_review that was flagged, the freelancer who flagged it and all info about the client_who_flagged equal to null if it was flagged by a freelancer', async() => {
			const flagged_review = await FlaggedFreelancerReviews.findOne(id);

			expect(flagged_review).to.be.an.object();
			expect(flagged_review.id).to.equal(id);
			expect(flagged_review.freelancer_review_id).to.equal(freelancer_review_id);
			expect(flagged_review.freelancer_review_review_text).to.equal(review);
			expect(flagged_review.client_who_flagged).to.equal(null);
			expect(flagged_review.flagging_client_first_name).to.equal(null);
			expect(flagged_review.flagging_client_last_name).to.equal(null);
			expect(flagged_review.freelancer_who_flagged).to.equal(freelancer_who_flagged);
			expect(flagged_review.flagging_freelancer_first_name).to.equal(freelancer_first_name);
			expect(flagged_review.flagging_freelancer_last_name).to.equal(freelancer_last_name);
			expect(flagged_review.reason).to.equal(reason);
			expect(flagged_review.created_at).to.be.a.date();
			expect(flagged_review.updated_at).to.equal(null);
		});

		it('should retrieve a specific flagged_freelancer_review record with a given id, and return the object with relevant information about the client who flagged it and all info about the freelancer_who_flagged equal to null if it was flagged by a client', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificReviewId = createData.freelancer_review_id;
			createData.freelancer_who_flagged = null;
			createData.client_who_flagged = client_who_flagged;

			await random.flagged_freelancer_review(createData);
			const flagged_review = await FlaggedFreelancerReviews.findOne(specificId);

			expect(flagged_review).to.be.an.object();
			expect(flagged_review.id).to.equal(specificId);
			expect(flagged_review.freelancer_review_id).to.equal(specificReviewId);
			expect(flagged_review.client_who_flagged).to.equal(client_who_flagged);
			expect(flagged_review.flagging_client_first_name).to.equal(client_first_name);
			expect(flagged_review.flagging_client_last_name).to.equal(client_last_name);
			expect(flagged_review.freelancer_who_flagged).to.equal(null);
			expect(flagged_review.flagging_freelancer_first_name).to.equal(null);
			expect(flagged_review.flagging_freelancer_last_name).to.equal(null);
			expect(flagged_review.reason).to.equal(reason);
			expect(flagged_review.created_at).to.be.a.date();
			expect(flagged_review.updated_at).to.equal(null);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'find', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_review = await random.flagged_freelancer_review(createData);

			expect(flagged_review).to.be.an.object();
			expect(flagged_review.id).to.equal(specificId);

			const result = await FlaggedFreelancerReviews.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'delete', {});
		});
	});


	describe('has cascading delete on freelancer_review_id, client_who_flagged, and freelancer_who_flagged', () => {
		it('should be deleted in the event of the freelancer_review that was flagged is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificReviewId = createData.freelancer_review_id,
				flagged_review = await random.flagged_freelancer_review(createData);

			expect(flagged_review).to.be.an.object();
			expect(flagged_review.id).to.equal(specificId);
			expect(flagged_review.freelancer_review_id).to.equal(specificReviewId);

			const result = await FreelancerReviews.delete(specificReviewId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'find', specificId);
		});

		it('should be deleted in the event of the freelancer who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				flagged_review = await random.flagged_freelancer_review(createData);

			expect(flagged_review).to.be.an.object();
			expect(flagged_review.id).to.equal(specificId);
			expect(flagged_review.freelancer_who_flagged).to.equal(freelancer_who_flagged);

			const result = await Freelancers.delete(freelancer_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'find', specificId);
		});

		it('should be deleted in the event of the client who created the flag is deleted.', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;
			const flagged_review = await random.flagged_freelancer_review(createData);

			expect(flagged_review).to.be.an.object();
			expect(flagged_review.id).to.equal(specificId);
			expect(flagged_review.client_who_flagged).to.equal(client_who_flagged);

			const result = await Clients.delete(client_who_flagged);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FlaggedFreelancerReviews, 'flagged_freelancer_review', 'find', specificId);
		});
	});
});
