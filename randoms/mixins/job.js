'use strict';


const random = new (require('chance'));
const Jobs = require(`${process.cwd()}/src/models/jobs`);

// used to create a random job. If given no parameters, randomizes all fields.
module.exports = async(opts = {}) => {
	// if the needed foreign keys aren't given, we create them here
	if (!opts.field_id) {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	}
	if (!opts.client_id) {
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });
	}


	return Jobs.create({
		id: opts.id || random.guid(),
		field_id: opts.field_id,
		client_id: opts.client_id,
		freelancer_id: opts.freelancer_id || null,
		title: opts.title || random.sentence(),
		rate: opts.rate || random.integer({ min: 15, max: 80 }),
		rate_type: opts.rate_type || 'hourly',
		description: opts.description || random.paragraph(),
		state: opts.state || 'TX',
		city: opts.city || random.word(),
		zip: opts.zip || random.zip(),
		onsite_required: opts.onsite_required == undefined? random.bool() : opts.onsite_required,
		available: opts.available == undefined? random.bool() : opts.available,
		closed: opts.closed == undefined? random.bool() : opts.closed,
		experience_level_requested: opts.experience_level_requested || 'any',
	});
};
