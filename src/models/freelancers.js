'use strict';


const UserModel = require('./user_model');
const Freelancers = new UserModel('freelancers');
const _ = require('lodash');


module.exports = {
	getAll () {
		// TODO: to be setup with pagination later
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
