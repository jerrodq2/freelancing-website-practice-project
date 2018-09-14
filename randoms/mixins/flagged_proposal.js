'use strict';


const random = new (require('chance'));
const FlaggedProposals = require(`${process.cwd()}/src/services/flags/models/flagged_proposals`);

// used to create a random flagged_proposal. If given no parameters, randomizes all fields
module.exports = async(opts = {}) => {
	// incase we need a field_id for the below client and freelancers, we only have to create a field once
	const createFieldId = async() => {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	};

	// by creating a client and freelancer, we save them and 2 fields from having to be created in the various mixins for the proposal, this is especially helpful in the multi mixin
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


	// if the needed proposal isn't given, we create it here
	if (!opts.proposal_id) {
		if (!opts.client_id) await createClientId();
		if (!opts.freelancer_id) await createFreelancerId();

		const job_id = random.guid(); // create the job needed for the proposal, creating it here saves us from having to create more fields, clients, and freelancers in the job mixin
		await random.job({ id: job_id, field_id: opts.field_id, client_id: opts.client_id, freelancer_id: opts.freelancer_id, closed: false, available: true });

		opts.proposal_id = random.guid();
		await random.proposal({ id: opts.proposal_id, client_id: opts.client_id, freelancer_id: opts.freelancer_id, job_id });
	}

	// if the needed client_who_flagged isn't given, we create it here. This flag can only be created by a client
	if (!opts.client_who_flagged) {
		if (!opts.field_id) await createFieldId();
		opts.client_who_flagged = random.guid();
		await random.client({ id: opts.client_who_flagged, field_id: opts.field_id });
	}


	return FlaggedProposals.create({
		id: opts.id || random.guid(),
		proposal_id: opts.proposal_id,
		client_who_flagged: opts.client_who_flagged,
		reason: opts.reason || random.sentence(),
	});
};
