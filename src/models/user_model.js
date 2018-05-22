'use strict';


const MainModel = require('./main_model');
const knex = require('../config/knex');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// A specific class that extends the MainModel, used only for users (clients, freelancers, and amdins), to abstract re-used code and improve DRYness
class UserModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	createUser (data) {
		// hash the password
		data.password = hashPassword(data.password);
		return this.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	}


	// Same as the above create method but it doesn't hash the password. This is only used in tests and random mixins to speed up creation of multiple users (ex: 50 clients), not to be used in actual data or workflow.
	createWithoutHash (data) {
		return this.create(data).then((result) => _.omit(result, 'password', 'username'));
	}


	// also grabs the user's field
	findOneUser (id) {
		const selectedColumns = [`${this.tableName}.*`, 'fields.field'];
		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			.innerJoin('fields', `${this.tableName}.field_id`, 'fields.id')
			.then((result) => result[0])
			.then((result) => _.omit(result, 'password', 'field_id', 'username'));
	}


	// TODO: Separate update method for updating password and username, perhaps one for email and field as well. Change model tests accordingly for this method.
	update (id, data) {
		return this.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	}

}


module.exports = UserModel;
