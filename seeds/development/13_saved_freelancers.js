'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const SavedFreelancers = require(`${process.cwd()}/src/models/saved_freelancers`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('saved_freelancers').del();
	// Inserts seed entries

};
