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

	update (id, data) {
		return Clients.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	delete (id) {
		return Clients.delete(id);
	}

};
