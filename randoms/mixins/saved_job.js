'use strict';


const random = new (require('chance'));
const SavedJobs = require(`${process.cwd()}/src/models/saved_jobs`);

// used to create a random saved_client. If given no parameters, randomizes all fields
module.exports = async(opts = {}) => {
	// incase we need a field_id for the two below conditionals, we only have to create a field once
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

	if (!opts.job_id) {
		if (!opts.field_id) await createFieldId();
		opts.job_id = random.guid();
		await random.job({ id: opts.job_id, field_id: opts.field_id });
	}


	return SavedJobs.create({
		id: opts.id || random.guid(),
		freelancer_id: opts.freelancer_id,
		job_id: opts.job_id,
	});
};
