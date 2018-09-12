'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const FlaggedJobs = require(`${process.cwd()}/src/services/flags/models/flagged_jobs`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('flagged_jobs').del();
	// Inserts seed entries
	return Promise.all([
		FlaggedJobs.create({
			job_id: jobIds.bad_database,
			client_who_flagged: clientIds.peter,
			reason: 'Trying to get me to use another website',
		}),

		FlaggedJobs.create({
			job_id: jobIds.bad_database,
			freelancer_who_flagged: freelancerIds.ryan,
			reason: 'Somethings not right',
		}),

		FlaggedJobs.create({
			job_id: jobIds.bad_website,
			client_who_flagged: clientIds.natasha,
			reason: 'Seems fake',
		}),

		FlaggedJobs.create({
			job_id: jobIds.bad_website,
			freelancer_who_flagged: freelancerIds.dick,
			reason: 'The request seems fishy',
		}),
	]);

};
