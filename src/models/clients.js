'use strict';


const Model = require('./model');
const Clients = new Model('clients');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
	},

	findOne (id) {
		return Clients.findOneUser(id)
			.then((result) => _.omit(result, 'password', 'field_id', 'username'));
	},

	create (data) {
		// hash the password
		data.password = hashPassword(data.password);
		return Clients.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	// Same as the create above but it doesn't hash the password. This is only used in tests and random mixins to speed up creation of multiple clients (ex: 50 clients), not to be used in actual data or workflow.
	createWithoutHash (data) {
		// Hashed password is already given to save time.
		return Clients.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	// TODO: Separate update method for updating password and username, perhaps one for emaila and field as well. Change model tests accordingly for this method.
	update (id, data) {
		return Clients.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	delete (id) {
		return Clients.delete(id);
	}

};
