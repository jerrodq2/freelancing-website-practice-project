'use strict';


const Model = require('./model');
const Clients = new Model('clients');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


module.exports = {

	getAll () {
		// to be setup with pagination later
	},

	findOne (id) {
		return Clients.findOneUser(id)
			.then((client) => _.omit(client, 'password', 'field_id'));
	},

	create (data) {
		// hash the password
		data.password = hashPassword(data.password);
		return Clients.create(data)
			.then((client) => _.omit(client, 'password'));
	},

	update (id, data) {
		return Clients.updateById(id, data)
			.then((client) => _.omit(client, 'password'));
	},

	delete (id) {
		return Clients.delete(id);
	}

};
