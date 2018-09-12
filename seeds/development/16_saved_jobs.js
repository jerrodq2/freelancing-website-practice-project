'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const SavedJobs = require(`${process.cwd()}/src/services/saved_objects/models/saved_jobs`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('saved_jobs').del();
	// Inserts seed entries
	return Promise.all([
		SavedJobs.create({
			freelancer_id: freelancerIds.dick,
			job_id: jobIds.batwing,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.naruto,
			job_id: jobIds.personal_website,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.jessica,
			job_id: jobIds.batwing,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.jessica,
			job_id: jobIds.hs_website,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.ryan,
			job_id: jobIds.hs_website,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.izuku,
			job_id: jobIds.ecommerce_repair_site,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.jessica,
			job_id: jobIds.software_project,
		}),

		SavedJobs.create({
			freelancer_id: freelancerIds.jerrod,
			job_id: jobIds.front_end_site,
		}),
	]);

};
