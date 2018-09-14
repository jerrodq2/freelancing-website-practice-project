'use strict';


const miscIds = require(`${process.cwd()}/seeds/ids/misc`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const FlaggedProposals = require(`${process.cwd()}/src/services/flags/models/flagged_proposals`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_proposals').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedProposals.create({
			proposal_id: miscIds.joker_proposal,
			client_who_flagged: clientIds.peter,
			reason: 'This seems strange',
		}),
	]);

};
