'use strict';


const UserModel = require('./user_model');
const Clients = new UserModel('clients');


module.exports = {
	// TODO: method to switch from active to inactive or should we just use the update method? Should there be one for both, or just one that switches back and forth? Here or in say the admin model?
	getAll () {
		// TODO: to be setup with pagination later, make sure to include the active field in the getAll search
	},


	create (data) {
		return Clients.createUser(data);
	},


	createWithoutHash (data) {
		return Clients.createWithoutHash(data);
	},


	findOne (id) {
		return Clients.findOneUser(id);
	},


	update (id, data) {
		return Clients.update(id, data);
	},


	delete (id) {
		return Clients.delete(id);
	}

};
