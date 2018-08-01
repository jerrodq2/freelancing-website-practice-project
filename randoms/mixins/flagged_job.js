'use strict';


const random = new (require('chance'));
const FlaggedJobs = require(`${process.cwd()}/src/models/flagged_jobs`);

// used to create a random flagged_job. If given no parameters, randomizes all fields, creates a flag created by a freelancer by default
module.exports = async(opts = {}) => {
	// incase we need a field_id for the below job and freelancer, we only have to create a field once
	const createFieldId = async() => {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	};


	// if the needed job isn't given, we create it here
	if (!opts.job_id) {
		if (!opts.field_id) await createFieldId();
		opts.job_id = random.guid();
		await random.job({ id: opts.job_id, field_id: opts.field_id });
	}

	// if we aren't given either of these keys, we set the flag to be created by a freelancer by default
	if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
		if (!opts.field_id) await createFieldId();
		opts.freelancer_who_flagged = random.guid();
		await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
	}


	return FlaggedJobs.create({
		id: opts.id || random.guid(),
		job_id: opts.job_id || null,
		client_who_flagged: opts.client_who_flagged || null,
		freelancer_who_flagged: opts.freelancer_who_flagged || null,
		reason: opts.reason || random.sentence(),
	});
};
