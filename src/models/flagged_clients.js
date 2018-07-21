'use strict';


const Model = require('./flag_model');
const FlaggedClients = new Model('flagged_clients');
const knex = require('../config/knex');
const Errors = require(`${process.cwd()}/src/lib/errors`);


// a function used in create below, checks that the user hasn't already flagged the given client before. Code was re-used in both if conditionals with only the where statement being different, so I abstracted it
// const check_on_flag = async(data) => {
// 	const result = await knex('flagged_clients').where(data)
// 		.catch((err) => {
// 			// throw error if the id wasn't given in proper uuid format
// 			if (Errors.violatesIdSyntax(err))
// 				throw Errors.badId('flagged_client', 'create');
// 			// the cause of the error is most likely a missing client_id if this passes
// 			if (!data.client_id)
// 				throw Errors.badNull('flagged_client', 'create', 'client_id');
// 			// if the cause of the error wasn't found above, throw the given error
// 			throw err;
// 		});
//
// 	return result;
// };


module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	async create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.client_id)
			throw Errors.badNull('flagged_client', 'create', 'client_id');

		return FlaggedClients.createFlag(data, 'client');

		// // first we grab the two potential types of users that created the flag and the client that is being flagged
		// const { client_who_flagged, freelancer_who_flagged, client_id } = data;
		// let createCheck, user_who_flagged;
		//
		// // Now, we test which parameter was actually passed to us, and based on this, we can do a pre-create check to make sure the user hasn't already flagged this client
		// if (freelancer_who_flagged && !client_who_flagged) {
		// 	createCheck = await check_on_flag({ client_id, freelancer_who_flagged });
		// 	user_who_flagged = 'freelancer'; // used in the message below
		//
		// } else if (!freelancer_who_flagged && client_who_flagged) {
		// 	createCheck = await check_on_flag({ client_id, client_who_flagged });
		// 	user_who_flagged = 'client'; // used in the message below
		//
		// } else {
		// 	// if we reached this conditional, then we weren't passed either freelancer_who_flagged or client_who_flagged, so we raise an exception
		// 	throw Errors.badNull('flagged_client', 'create', 'freelancer_who_flagged and client_who_flagged');
		// }
		//
		// // Next, we check to see if either of the above queries returned a result. If so, then this user has already flagged this client, so we raise an exception
		// if (createCheck[0]) {
		// 	const message = `The flagged_client you are trying to create can't be completed. This ${user_who_flagged} has already flagged this client`;
		//
		// 	throw Errors.Boom.badRequest(message);
		// }
		//
		// return FlaggedClients.create(data);
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		// TODO: put a link in the view leading to the client profile for more info, and the to the user who flagged it
		const flagColumns = ['flagged_clients.*'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const flaggingClientColumns = ['fc.id as client_who_flagged', 'fc.first_name as flagging_client_first_name', 'fc.last_name as flagging_client_last_name'];
		const flaggingFreelancerColumns = ['ff.id as freelancer_who_flagged', 'ff.first_name as flagging_freelancer_first_name', 'ff.last_name as flagging_freelancer_last_name'];

		const selectedColumns = flagColumns.concat(clientColumns, flaggingClientColumns, flaggingFreelancerColumns);
		return knex('flagged_clients')
			.select(selectedColumns)
			.where(knex.raw(`flagged_clients.id = '${id}'`))
			.innerJoin('clients as c', 'flagged_clients.client_id', 'c.id')
			.leftJoin('clients as fc', 'flagged_clients.client_who_flagged', 'fc.id')
			.leftJoin('freelancers as ff', 'flagged_clients.freelancer_who_flagged', 'ff.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('flagged_client', 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('flagged_client', 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	delete (id) {
		return FlaggedClients.delete(id);
	}
};
