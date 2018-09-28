'use strict';


// This file is used to create a random saved_job record for testing. If given no parameters, randomizes all fields
const random = new (require('chance'));
const SavedJobs = require(`${process.cwd()}/src/services/saved_objects/models/saved_jobs`);


module.exports = async(opts = {}) => {
	// incase we need a field_id for the two below conditionals, we only have to create a field once
	const createFieldId = async() => {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	};
	// incase we need a client to create the job below. Used mainly in the event of the saved_jobs mixin being used, without this, we would create 10 clients for 10 jobs, with this, we only creat 1 client and use it for all 10 jobs, saves db work
	const createClientId = async() => {
		if (!opts.field_id) await createFieldId();
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });
	};

	// if the needed foreign keys aren't given, we create them here
	if (!opts.freelancer_id) {
		if (!opts.field_id) await createFieldId();
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
	}

	if (!opts.job_id) {
		if (!opts.field_id) await createFieldId();
		if (!opts.client_id) await createClientId();
		opts.job_id = random.guid();
		await random.job({ id: opts.job_id, field_id: opts.field_id, client_id: opts.client_id });
	}


	return SavedJobs.create({
		id: opts.id || random.guid(),
		freelancer_id: opts.freelancer_id,
		job_id: opts.job_id,
	});
};
