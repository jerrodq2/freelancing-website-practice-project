'use strict';


// This file creates the admins model as a new instance of the user_model
const UserModel = require('./user_model');
const Admins = new UserModel('admins');
const _ = require('lodash');


module.exports = {
	getAll () {
		// TODO: to be setup with pagination later
	},


	create (data) {
		return Admins.createUser(data);
	},


	// goes through the mainModel findOne, as opposed to the UserModel findOneUser, since admins don't have a field_id
	findOne (id) {
		return Admins.findOne(id)
			.then((result) => _.omit(result, 'password', 'username'));
	},


	update (id, data) {
		return Admins.update(id, data);
	},


	delete (id) {
		return Admins.delete(id);
	}

};
