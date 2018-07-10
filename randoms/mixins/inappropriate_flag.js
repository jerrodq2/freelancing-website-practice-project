'use strict';


const random = new (require('chance'));
const InappropriateFlags = require(`${process.cwd()}/src/models/inappropriate_flags`);
const _ = require('lodash');

// used to create a random inappropriate_flag. If given no parameters, randomizes all fields, and creates a flag for a job by default, since many things can be flagged. The complexity and openness of this table means that all fields can be null, and makes it difficult to require any fields if any data is given.
module.exports = async(opts = {}) => {
	// if no data is given, I create a job and freelancer for the scenario of a freelancer flagging a job
	if (_.isEmpty(opts)){
		opts.job_id = random.guid();
		await random.job({ id: opts.job_id });

		opts.freelancer_who_flagged = random.guid();
		await random.freelancer({ id: opts.freelancer_who_flagged });
	}

	return InappropriateFlags.create({
		id: opts.id || random.guid(),
		job_id: opts.job_id || null,
		client_id: opts.client_id || null,
		freelancer_id: opts.freelancer_id || null,
		client_review_id: opts.client_review_id || null,
		freelancer_review_id: opts.freelancer_review_id || null,
		proposal_id: opts.proposal_id || null,
		invitation_id: opts.invitation_id || null,
		client_who_flagged: opts.client_who_flagged || null,
		freelancer_who_flagged: opts.freelancer_who_flagged || null,
	});
};
