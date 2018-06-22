'use strict';


const random = new (require('chance'));
const ClientReviews = require(`${process.cwd()}/src/models/client_reviews`);

// used to create a random client_reviews. If given no parameters, randomizes all fields
module.exports = async(opts = {}) => {
	// incase we need a field_id for the three below conditionals, we only have to create a field once
	let field_id;
	const createFieldId = async() => {
		field_id = random.guid();
		await random.field({ id: field_id });
	};

	// if the needed foreign keys aren't given, we create them here
	if (!opts.freelancer_id) {
		if (!field_id) await createFieldId();
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id, field_id });
	}
	if (!opts.client_id) {
		if (!field_id) await createFieldId();
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id });
	}
	if (!opts.job_id) {
		if (!field_id) await createFieldId();
		opts.job_id = random.guid();
		await random.job({ id: opts.job_id, field_id, client_id: opts.client_id });
	}


	return ClientReviews.create({
		id: opts.id || random.guid(),
		rating: opts.rating || random.integer({ min: 1, max: 5 }),
		review: opts.review || random.paragraph(),
		freelancer_id: opts.freelancer_id,
		client_id: opts.client_id,
		job_id: opts.job_id,
	});
};
