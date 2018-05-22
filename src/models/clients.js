'use strict';


const UserModel = require('./user_model');
const Clients = new UserModel('clients');


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


	update (id, data) {
		return Clients.update(id, data);
	},


	delete (id) {
		return Clients.delete(id);
	}

};
