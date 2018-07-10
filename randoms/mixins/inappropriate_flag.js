'use strict';


const random = new (require('chance'));
const InappropriateFlags = require(`${process.cwd()}/src/models/inappropriate_flags`);
const _ = require('lodash');

// used to create a random inappropriate_flag. If given no parameters, randomizes all fields, and creates a flag for a job by default, since many things can be flagged. The complexity and openness of this table means that all fields can be null, and makes it difficult to require any fields if any data is given.
module.exports = async(opts = {}, createClient = false) => {
	// if no data is given, I create a client and freelancer for the scenario of a freelancer flagging a client. This is easier db work than having to create, say a job, which would also create a client, field, etc.
	if (_.isEmpty(opts)){
		// incase we need a field_id for the below client and freelancer, we only have to create a field once
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}


		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });

		opts.freelancer_who_flagged = random.guid();
		await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
	} else if (createClient) {
		// if createClient is true, then the multi mixin is being used. In this case, no data was passed to the mixin, and the freelancer and field was created in the multi mixin, with a new client created for every record, so we create the client here.
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });
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
