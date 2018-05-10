'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const SavedJobs = require(`${process.cwd()}/src/models/saved_jobs`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('saved_jobs').del();
	// Inserts seed entries

};
