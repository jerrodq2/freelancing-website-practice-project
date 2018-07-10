'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const otherIds = require(`${process.cwd()}/seeds/ids/misc`);
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
		}),

		InappropriateFlags.create({
			job_id: jobIds.bad_database,
			freelancer_who_flagged: freelancerIds.leon,
		}),

		InappropriateFlags.create({
			job_id: jobIds.bad_website,
			freelancer_who_flagged: freelancerIds.jessica,
		}),

		InappropriateFlags.create({
			freelancer_id: freelancerIds.joker,
			client_who_flagged: clientIds.bruce,
		}),

		InappropriateFlags.create({
			proposal_id: otherIds.joker_proposal,
			client_who_flagged: clientIds.peter,
		}),

		InappropriateFlags.create({
			invitation_id: otherIds.loki_invitation,
			freelancer_who_flagged: freelancerIds.leon,
		}),

		InappropriateFlags.create({
			freelancer_review_id: otherIds.natasha_review,
			freelancer_who_flagged: freelancerIds.jessica,
		}),

		InappropriateFlags.create({
			client_review_id: otherIds.jessica_review,
			client_who_flagged: clientIds.natasha,
		}),
	]);
};
