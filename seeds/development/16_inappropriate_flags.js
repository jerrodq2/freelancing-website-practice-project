'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const InappropriateFlags = require(`${process.cwd()}/src/models/inappropriate_flags`);

// TODO: create a few more client, freelancer, and job seeds just for this
exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('inappropriate_flags').del();
	// Inserts seed entries
	return Promise.all([
		InappropriateFlags.create({
			client_id: clientIds.loki,
			freelancer_who_flagged: freelancerIds.jerrod,
			message: 'He\'s up to no good!',
		}),

		InappropriateFlags.create({
			job_id: jobIds.bad_database,
			freelancer_who_flagged: freelancerIds.leon,
			message: 'Seems sketchy',
		}),

		InappropriateFlags.create({
			job_id: jobIds.bad_website,
			freelancer_who_flagged: freelancerIds.jessica,
			message: 'Too large of a payment',
		}),

		InappropriateFlags.create({
			freelancer_id: freelancerIds.joker,
			client_who_flagged: clientIds.bruce,
			message: 'He\'s a prince of crime, do I really need to explain?',
		}),

		// InappropriateFlags.create({
		// 	job_id: jobIds.loki,
		// 	freelancer_who_flagged: freelancerIds.leon,
		// 	message: 'He',
		// }),
	]);
};
