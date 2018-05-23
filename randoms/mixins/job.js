'use strict';


const random = new (require('chance'));
const Jobs = require(`${process.cwd()}/src/models/jobs`);

// used to create a random job. If given no parameters, randomizes most fields.
// A field_id and client_id is required, for simplicity we don't create them here
module.exports = (opts = {}) => Jobs.create({
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
	onsite_required: opts.onsite_required || random.bool(),
	available: opts.available || random.bool(),
	closed: opts.closed || random.bool(),
	experience_level_requested: opts.experience_level_requested || 'any',
});
