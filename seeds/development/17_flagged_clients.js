'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const FlaggedClients = require(`${process.cwd()}/src/models/flagged_clients`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_clients').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedClients.create({
			client_id: clientIds.loki,
			freelancer_who_flagged: freelancerIds.jerrod,
			reason: 'Seems sketchy',
		}),

		FlaggedClients.create({
			client_id: clientIds.loki,
			freelancer_who_flagged: freelancerIds.jessica,
			reason: 'Fake profile.',
		}),

		FlaggedClients.create({
			client_id: clientIds.loki,
			client_who_flagged: clientIds.tony,
			reason: 'Don\'t trust him.',
		}),
	]);

};
