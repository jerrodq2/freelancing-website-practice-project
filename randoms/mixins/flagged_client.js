'use strict';


// This file is used to create a random flagged_client record for testing. If given no parameters, randomizes all fields, creates a flag created by a freelancer by default
const random = new (require('chance'));
const FlaggedClients = require(`${process.cwd()}/src/services/flags/models/flagged_clients`);


module.exports = async(opts = {}) => {
	// incase we need a field_id for the below client and freelancer, we only have to create a field once
	const createFieldId = async() => {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	};


	// if the needed client_id isn't given, we create it here
	if (!opts.client_id) {
		if (!opts.field_id) await createFieldId();
		opts.client_id = random.guid();
		await random.client({ id: opts.client_id, field_id: opts.field_id });
	}

	// if we aren't given either of these keys, we set the flag to be created by a freelancer by default
	if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
		if (!opts.field_id) await createFieldId();
		opts.freelancer_who_flagged = random.guid();
		await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
	}


	return FlaggedClients.create({
		id: opts.id || random.guid(),
		client_id: opts.client_id,
		client_who_flagged: opts.client_who_flagged || null,
		freelancer_who_flagged: opts.freelancer_who_flagged || null,
		reason: opts.reason || random.sentence(),
	});
};
