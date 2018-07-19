'use strict';


const Model = require('./main_model');
const FlaggedClients = new Model('flagged_clients');
const knex = require('../config/knex');
const Errors = require(`${process.cwd()}/src/lib/errors`);


const check_on_flag = async(data) => {
	const result = await knex('flagged_clients').where(data)
		.catch((err) => {
			// throw error if the id wasn't given in proper uuid format
			if (Errors.violatesIdSyntax(err))
				throw Errors.badId('flagged_client', 'create');
			// the cause of the error is most likely a missing client_id if this passes
			if (!data.client_id)
				throw Errors.badNull('flagged_client', 'create', 'client_id');
			// if the cause of the error wasn't found above, throw the given error
			throw err;
		});

	return result;
};

module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	async create (data) {
		// first we grab the two potential types of users that created the flag and the client that is being flagged
		const { client_who_flagged, freelancer_who_flagged, client_id } = data;
		let createCheck, user;

		// Now, we test which parameter was actually passed to us, and based on this, we can do a pre-create check to make sure the user hasn't already flagged this client
		if (freelancer_who_flagged && !client_who_flagged) {
			createCheck = await check_on_flag({ client_id, freelancer_who_flagged });
			user = 'freelancer'; // used in the message below

		} else if (!freelancer_who_flagged && client_who_flagged) {
			createCheck = await check_on_flag({ client_id, client_who_flagged });
			user = 'client'; // used in the message below

		} else {
			// if we reached this conditional, then we weren't passed either freelancer_who_flagged or client_who_flagged, so we raise an exception
			throw Errors.badNull('flagged_client', 'create', 'freelancer_who_flagged and client_who_flagged'); //TODO: TEST THIS
		}

		// Next, we check to see if either of the above queries returned a result. If so, then this user has already flagged this client, so we raise an exception
		if (createCheck[0]) {
			const message = `The flagged_client you are trying to create can't be completed. This ${user} has already flagged this client`;

			throw Errors.Boom.badRequest(message);
		}

		return FlaggedClients.create(data);
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		return FlaggedClients.findOne(id);
	},


	delete (id) {
		return FlaggedClients.delete(id);
	}
};
