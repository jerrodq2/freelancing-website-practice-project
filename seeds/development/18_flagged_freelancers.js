'use strict';


// This file seeds the database with starting flagged freelancers using the already inserted clients, and freelancers
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const FlaggedFreelancers = require(`${process.cwd()}/src/services/flags/models/flagged_freelancers`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_freelancers').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedFreelancers.create({
			freelancer_id: freelancerIds.joker,
			client_who_flagged: clientIds.bruce,
			reason: 'He\'ll cause a lot of trouble',
		}),

		FlaggedFreelancers.create({
			freelancer_id: freelancerIds.joker,
			client_who_flagged: clientIds.loki,
			reason: 'Not bad enough.',
		}),

		FlaggedFreelancers.create({
			freelancer_id: freelancerIds.joker,
			freelancer_who_flagged: freelancerIds.dick,
			reason: 'He\'s dangerous.',
		}),
	]);

};
