'use strict';


const UserModel = require('./user_model');
const Freelancers = new UserModel('freelancers');


module.exports = {
	// TODO: method to switch from active to inactive? Should there be one for both, or just one that switches back and forth? Here or in say the admin model?
	getAll () {
		// TODO: to be setup with pagination later, make sure to include the active field in the getAll search
	},


	create (data) {
		return Freelancers.createUser(data);
	},


	createWithoutHash (data) {
		return Freelancers.createWithoutHash(data);
	},


	findOne (id) {
		return Freelancers.findOneUser(id);
	},


	update (id, data) {
		return Freelancers.update(id, data);
	},


	delete (id) {
		return Freelancers.delete(id);
	}

};
