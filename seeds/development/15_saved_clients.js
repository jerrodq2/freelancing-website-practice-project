'use strict';


// This file seeds the database with starting saved clients using the already inserted clients and freelancers
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const SavedClients = require(`${process.cwd()}/src/services/saved_objects/models/saved_clients`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('saved_clients').del();
	// Inserts seed entries
	return Promise.all([
		SavedClients.create({
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.bruce,
		}),

		SavedClients.create({
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.natasha,
		}),

		SavedClients.create({
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.peter,
		}),

		SavedClients.create({
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.tony,
		}),

		SavedClients.create({
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.peter,
		}),

		SavedClients.create({
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.natasha,
		}),
	]);
};
