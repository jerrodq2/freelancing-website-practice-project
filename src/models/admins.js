'use strict';


const Model = require('./model');
const Admins = new Model('admins');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


module.exports = {

	getAll () {
		// to be setup with pagination later
	},

	findOne (id) {
		return Admins.findOne(id)
			.then((client) => _.omit(client, 'password', 'username'));
	},

	create (data) {
		// hash the password
		data.password = hashPassword(data.password);
		return Admins.create(data)
			.then((client) => _.omit(client, 'password', 'username'));
	},

	update (id, data) {
		return Admins.updateById(id, data)
			.then((client) => _.omit(client, 'password', 'username'));
	},

	delete (id) {
		return Admins.delete(id);
	}

};
