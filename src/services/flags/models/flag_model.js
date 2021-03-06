'use strict';


// This file creates the flag_model, which extends the main_model with specifc methods that are used by all the other flag models (flagged_jobs, flagged_clients, etc.), to abstract re-used code and improve DRYness
const MainModel = require(`${process.cwd()}/src/services/main_model`);
const knex = require(`${process.cwd()}/src/config/knex`);
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// columns used in the knex join statements below, using in multilple methods, so they're declared up here
const flaggingClientColumns = ['fc.id as client_who_flagged', 'fc.first_name as flagging_client_first_name', 'fc.last_name as flagging_client_last_name'];
const flaggingFreelancerColumns = ['ff.id as freelancer_who_flagged', 'ff.first_name as flagging_freelancer_first_name', 'ff.last_name as flagging_freelancer_last_name'];


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


	async findOneFlag (id, givenColumn, joinText) {
		// TODO: put a link in the view leading to the objects (ex: client profile, job page, etc.) for more info, and the to the user who flagged it
		const flagColumns = [`${this.tableName}.*`];

		const selectedColumns = flagColumns.concat(flaggingClientColumns, flaggingFreelancerColumns, givenColumn);
		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			// since the join statement for the actual object being flagged (client, job, review, etc.) can be so different, the text is created in the model (flagged_clients, flagged_jobs, etc.) and passed here, to keep it as simple as possible. Example of the joinText below
			// example of joinText = ['clients as c', 'flagged_clients.client_id', 'c.id']
			.innerJoin(joinText[0], joinText[1], joinText[2])
			.leftJoin('clients as fc', `${this.tableName}.client_who_flagged`, 'fc.id')
			.leftJoin('freelancers as ff', `${this.tableName}.freelancer_who_flagged`, 'ff.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}


	// this is for the findOne of flagged_proposals and flagged_invitations. They are similar to the above findOne except both models can only be flagged by either a client or a freelancer, this causes errors in the join statements. For example, when you try to join the freelancers table for the freelancer_who_flagged to the flagged_proposal table, it causes an error since it doesn't have a freelancer_who_flagged field
	findOneInvitation (id, givenColumn, joinText, flaggingUser) {
		let selectedColumns, userJoinText;
		// TODO: put a link in the view leading to the objects (ex: client profile, job page, etc.) for more info, and the to the user who flagged it
		const flagColumns = [`${this.tableName}.*`];

		// based on which user can flag the respective table, we remove the join statement and column related to the other user, and build the appropriate joins statement. Ex: flagged_proposals can only be flagged by clients, so we remove any columns related to freelancers and make the userJoinText join the client and flagged_proposal tables
		if (flaggingUser === 'client') {
			selectedColumns = flagColumns.concat(flaggingClientColumns, givenColumn);
			userJoinText = ['clients as fc', `${this.tableName}.client_who_flagged`, 'fc.id'];

		} else if (flaggingUser === 'freelancer') {
			selectedColumns = flagColumns.concat(flaggingFreelancerColumns, givenColumn);
			userJoinText = ['freelancers as ff', `${this.tableName}.freelancer_who_flagged`, 'ff.id'];

		}

		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			// since the join statement for the actual object being flagged (client, job, review, etc.) can be so different, the text is created in the model (flagged_clients, flagged_jobs, etc.) and passed here, to keep it as simple as possible. Example of the joinText below
			// example of joinText = ['clients as c', 'flagged_clients.client_id', 'c.id']
			.innerJoin(joinText[0], joinText[1], joinText[2])
			.innerJoin(userJoinText[0], userJoinText[1], userJoinText[2])
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}

}


module.exports = FlagModel;
