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

};
