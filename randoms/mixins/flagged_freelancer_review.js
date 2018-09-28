'use strict';


// This file is used to create a random flagged_freelancer_review record for testing. If given no parameters, randomizes all fields, creates a flag created by a freelancer by default
const random = new (require('chance'));
const FlaggedFreelancerReviews = require(`${process.cwd()}/src/services/flags/models/flagged_freelancer_reviews`);


module.exports = async(opts = {}) => {
	// incase we need a field_id for the below client and freelancers, we only have to create a field once
	const createFieldId = async() => {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	};

	// by creating a client and freelancer, we save them and 2 field from having to be created in the various mixins for the client_review, this is especially helpful in the multi mixin
	const createClientId = async() => {
		if (!opts.field_id) await createFieldId();
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });
	};
	const createFreelancerId = async() => {
		if (!opts.field_id) await createFieldId();
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
	};


	// if the needed freelancer_review isn't given, we create it here
	if (!opts.freelancer_review_id) {
		if (!opts.client_id) await createClientId();
		if (!opts.freelancer_id) await createFreelancerId();

		const job_id = random.guid(); // create the job needed for the freelancer_review, creating it here saves us from having to create more fields, clients, and freelancers in the job mixin
		await random.job({ id: job_id, field_id: opts.field_id, client_id: opts.client_id, freelancer_id: opts.freelancer_id, closed: true, available: false });

		opts.freelancer_review_id = random.guid();
		await random.freelancer_review({ id: opts.freelancer_review_id, client_id: opts.client_id, freelancer_id: opts.freelancer_id, job_id });
	}

	// if we aren't given either of these keys, we set the flag to be created by a freelancer by default
	if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
		if (!opts.field_id) await createFieldId();
		opts.freelancer_who_flagged = random.guid();
		await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
	}


	return FlaggedFreelancerReviews.create({
		id: opts.id || random.guid(),
		freelancer_review_id: opts.freelancer_review_id,
		client_who_flagged: opts.client_who_flagged || null,
		freelancer_who_flagged: opts.freelancer_who_flagged || null,
		reason: opts.reason || random.sentence(),
	});
};
