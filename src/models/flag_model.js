'use strict';


const MainModel = require('./main_model');
const knex = require('../config/knex');
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// a specific class that extends the MainModel, used only for flag models (flagged_clients, flagged_jobs, etc.), to abstract re-used code and improve DRYness
class FlagModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	// a function used in create below, checks that the user hasn't already flagged the record in question before (ex: already flagged a job or client). Code was re-used in both if conditionals with only the where statement being different, so I abstracted it
	async check_on_flag (givenData) {
		// we only need the flagging user (client/freelancer_who_flagged) and the object being flagged (client, job, review, etc.) for this check
		const data = _.omit(givenData, 'id', 'reason');

		const result = await knex(`${this.tableName}`).where(data)
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'create');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		return result;
	}


	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	async createFlag (data, object) {
		// first we grab the two potential types of users that created the flag
		const { client_who_flagged, freelancer_who_flagged } = data;
		let createCheck, user_who_flagged;

		// Now, we test which parameter was actually passed to us, and based on this, we can do a pre-create check to make sure the user hasn't already flagged this object (client, job, review, etc.)
		if (freelancer_who_flagged && !client_who_flagged) {
			createCheck = await this.check_on_flag(data);
			user_who_flagged = 'freelancer'; // used in the message below

		} else if (!freelancer_who_flagged && client_who_flagged) {
			createCheck = await this.check_on_flag(data);
			user_who_flagged = 'client'; // used in the message below

		} else {
			// if we reached this conditional, then we weren't passed either the freelancer_who_flagged or client_who_flagged, so we raise an exception
			throw Errors.badNull(toSingular(this.tableName), 'create', 'freelancer_who_flagged and client_who_flagged');
		}

		// Next, we check to see if either of the above queries returned a result. If so, then this user has already flagged the object (client, job, review, etc.), so we raise an exception
		if (createCheck[0]) {
			const message = `The ${toSingular(this.tableName)} you are trying to create can't be completed. This ${user_who_flagged} has already flagged this ${object}`;

			throw Errors.Boom.badRequest(message);
		}

		return this.create(data);
	}
}


module.exports = FlagModel;
