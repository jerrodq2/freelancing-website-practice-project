'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const JobActivity = require(`${process.cwd()}/src/models/job_activity`);

// TODO: Determine when a job should be added to a freelancer's job_activity. When accepted? finishd? TBD, also make sure that the model matches. The below seeds are all for finished job seeds.
exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('job_activity').del();
	// Inserts seed entries
	return Promise.all([
		JobActivity.create({
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
			job_id: jobIds.wordpress,
		}),

		JobActivity.create({
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.bruce,
			job_id: jobIds.batwing,
		}),

		JobActivity.create({
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
			job_id: jobIds.personal_website,
		}),

		JobActivity.create({
			freelancer_id: freelancerIds.izuku,
			client_id: clientIds.peter,
			job_id: jobIds.ecommerce_repair_site,
		}),

		JobActivity.create({
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.natasha,
			job_id: jobIds.wordpress_site,
		}),

		JobActivity.create({
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.natasha,
			job_id: jobIds.full_stack_site,
		}),

	]);
};
