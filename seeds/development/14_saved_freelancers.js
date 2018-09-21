'use strict';


// This file seeds the database with starting saved freelancers using the already inserted clients and freelancers
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const SavedFreelancers = require(`${process.cwd()}/src/services/saved_objects/models/saved_freelancers`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('saved_freelancers').del();
	// Inserts seed entries
	return Promise.all([
		SavedFreelancers.create({
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
		}),

		SavedFreelancers.create({
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.bruce,
		}),

		SavedFreelancers.create({
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
		}),

		SavedFreelancers.create({
			freelancer_id: freelancerIds.izuku,
			client_id: clientIds.jack,
		}),

		SavedFreelancers.create({
			freelancer_id: freelancerIds.leon,
			client_id: clientIds.natasha,
		}),

		SavedFreelancers.create({
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.natasha,
		}),
	]);
};
