'use strict';


const random = new (require('chance'));
const Invitations = require(`${process.cwd()}/src/models/invitations`);

// used to create a random invitation. If given no parameters, randomizes all fields
module.exports = async(opts = {}) => {
	// incase we need a field_id for the below conditionals, we only have to create a field once
	const createFieldId = async() => {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	};

	// if the needed foreign keys aren't given, we create them here
	if (!opts.freelancer_id) {
		if (!opts.field_id) await createFieldId();
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
	}

	if (!opts.client_id) {
		if (!opts.field_id) await createFieldId();
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });
	}

	if (!opts.job_id) {
		if (!opts.field_id) await createFieldId();
		opts.job_id = random.guid();
		await random.job({ id: opts.job_id, field_id: opts.field_id, freelancer_id: opts.freelancer_id, client_id: opts.client_id });
	}


	return Invitations.create({
		id: opts.id || random.guid(),
		freelancer_id: opts.freelancer_id,
		client_id: opts.client_id,
		job_id: opts.job_id,
		title: opts.title || random.word(),
		description: opts.description || random.paragraph(),
		requested_time_limit: opts.requested_time_limit || null, // may test this in more detail later on
		status: opts.status || 'pending',
	});
};
