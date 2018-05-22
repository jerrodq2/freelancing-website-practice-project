'use strict';


// const Model = require('./main_model');
const Model = require('./user_model');
const Clients = new Model('clients');
const _ = require('lodash');


module.exports = {
	getAll () {
		// TODO: to be setup with pagination later
	},


	findOne (id) {
		return Clients.findOneUser(id);
	},


	create (data) {
		return Clients.createUser(data);
	},


	createWithoutHash (data) {
		return Clients.createWithoutHash(data);
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
