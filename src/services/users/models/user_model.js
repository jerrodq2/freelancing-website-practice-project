'use strict';


// This file creates the user_model, which extends the main_model with specifc methods that are used by the client, freelancer, and admin models, to abstract re-used code and improve DRYness
const MainModel = require(`${process.cwd()}/src/services/main_model`);
const knex = require(`${process.cwd()}/src/config/knex`);
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


class UserModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	createUser (data) {
		if (!data.password) throw Errors.badNull(toSingular(this.tableName), 'create', 'password');
		// hash the password
		data.password = hashPassword(data.password);

		return this.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	}


	// Same as the above create method but it doesn't hash the password. This is only used in tests and random mixins to speed up creation of multiple users (ex: 50 clients), not to be used in actual data or workflow.
	createWithoutHash (data) {
		return this.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	}


	// finds one user and grabs the user's field through its field_id
	findOneUser (id) {
		const selectedColumns = [`${this.tableName}.*`, 'fields.field'];
		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			.innerJoin('fields', `${this.tableName}.field_id`, 'fields.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'find');

				return result[0];
			})
			.then((result) => _.omit(result, 'password', 'field_id', 'username'))
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}


	// TODO: Separate update method for updating password and username, perhaps one for email and field as well. Change model tests accordingly for this method.
	update (id, data) {
		return this.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	}

}


module.exports = UserModel;
