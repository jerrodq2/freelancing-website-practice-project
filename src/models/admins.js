'use strict';


const Model = require('./main_model');
const Admins = new Model('admins');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
	},

	findOne (id) {
		return Admins.findOne(id)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	create (data) {
		// hash the password
		data.password = hashPassword(data.password);
		return Admins.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	// TODO: Separate update method for updating password and username, perhaps one for email as well. Change model tests accordingly for this method.
	update (id, data) {
		return Admins.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	delete (id) {
		return Admins.delete(id);
	}

};
