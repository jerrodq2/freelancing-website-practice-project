'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedClientReviews = require(`${process.cwd()}/src/models/flagged_client_reviews`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Client Reviews Model', () => {
	// create the first flag as a freelancer flagging a client_review
	const id = random.guid(),
		client_review_id = random.guid(),
		client_id = random.guid(), // the client that each review will be about, saves us having to create a client for each one
		freelancer_id = random.guid(), // the freelancer that writes review, saves us having to create a freelancer for each one
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, client_review_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancers, used in the tests below
	const review = random.sentence(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		reviewData = { id: client_review_id, client_id, freelancer_id, review },

		clientData = { id: client_who_flagged, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.client({ id: client_id, field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client_review(reviewData);
		await random.client(clientData);
		await random.freelancer(freelancerData);
		await random.flagged_client_review(data);
	});


	// simple function that creates a new client_review that can be flagged
	const createNewData = async() => {
		const specificId = random.guid(),
			specificReviewId = random.guid(),
			obj = { id: specificId, client_review_id: specificReviewId },
			createData = Object.assign({}, data, obj);

		await random.client_review({ id: specificReviewId, client_id, field_id });
		return createData;
	};

	// checks all fields in a given flagged_client_review object
	const checkFields = (obj, givenId, givenReviewId = client_review_id, givenFlaggingClient = null, givenFlaggingFreelancer = freelancer_who_flagged) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.client_review_id).to.equal(givenReviewId);
		expect(obj.client_who_flagged).to.equal(givenFlaggingClient);
		expect(obj.freelancer_who_flagged).to.equal(givenFlaggingFreelancer);
		expect(obj.reason).to.equal(reason);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};

	describe('has a create method', () => {
		it('should allow you to create a new flagged_client_review if given valid data with the flag being created by a freelancer (freelancer_who_flagged), create new created_at and updated_at fields, and return the new flagged_client_review object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificReviewId = createData.client_review_id,
				flagged_review = await FlaggedClientReviews.create(createData);

			checkFields(flagged_review, specificId, specificReviewId);
		});

		it('should allow you to create a new flagged_client_review if given valid data with the flag being created by a client (client_who_flagged), create new created_at and updated_at fields, and return the new flagged_client_review object', async() => {
			const specificId = random.guid(),
				obj = { id: specificId, client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, data, obj),
				flagged_review = await FlaggedClientReviews.create(createData);

			checkFields(flagged_review, specificId, client_review_id, client_who_flagged, null);
		});

		it('shouldn\'t allow a client_review to be flagged twice by the same freelancer and should raise an exception on the second attempt', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				secondId = random.guid(),
				specificReviewId = createData.client_review_id,
				flagged_review = await FlaggedClientReviews.create(createData);

			checkFields(flagged_review, specificId, specificReviewId);
			createData.id = secondId;

			try {
				await FlaggedClientReviews.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_client_review');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('freelancer');
				expect(message).to.include('already flagged');
			}
		});

		it('shouldn\'t allow a client_review to be flagged twice by the same client and should raise an exception on the second attempt', async() => {
			const specificData = await createNewData(),
				specificId = specificData.id,
				secondId = random.guid(),
				specificReviewId = specificData.client_review_id,
				obj = { client_who_flagged, freelancer_who_flagged: null },
				createData = Object.assign({}, specificData, obj ),
				flagged_review = await FlaggedClientReviews.create(createData);

			checkFields(flagged_review, specificId, specificReviewId, client_who_flagged, null);
			createData.id = secondId;

			try {
				await FlaggedClientReviews.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;
				expect(message).to.be.a.string();
				expect(message).to.include('flagged_client_review');
				expect(message).to.include('create');
				expect(message).to.include('can\'t be completed');
				expect(message).to.include('client');
				expect(message).to.include('already flagged');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FlaggedClientReviews, 'flagged_client_review', 'create', createData);
		});

		it('should require either freelancer_who_flagged or client_who_flagged and should raise an exception if given neither', async() => {
			const createData = await createNewData();
			createData.freelancer_who_flagged = null;

			return checkErr.checkNotNull(FlaggedClientReviews, 'flagged_client_review', createData, 'freelancer_who_flagged and client_who_flagged');
		});

		it('should require a client_review_id to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedClientReviews, 'flagged_client_review', createData, 'client_review_id');
		});

		it('should require a reason to create', async() => {
			const createData = await createNewData();

			return checkErr.checkNotNull(FlaggedClientReviews, 'flagged_client_review', createData, 'reason');
		});


		it('should raise an exception if given an incorrect client_review_id (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedClientReviews, 'flagged_client_review', 'create', createData, 'client_review_id', random.guid());
		});

		it('should raise an exception if given an incorrect freelancer_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();

			return checkErr.checkForeign(FlaggedClientReviews, 'flagged_client_review', 'create', createData, 'freelancer_who_flagged', random.guid());
		});

		it('should raise an exception if given an incorrect client_who_flagged (foreign key not found)', async() => {
			const createData = await createNewData();
			createData.client_who_flagged = client_who_flagged;
			createData.freelancer_who_flagged = null;

			return checkErr.checkForeign(FlaggedClientReviews, 'flagged_client_review', 'create', createData, 'client_who_flagged', random.guid());
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
