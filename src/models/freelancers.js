'use strict';


const Model = require('./main_model');
const Freelancers = new Model('freelancers');
const _ = require('lodash');


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
	},

	findOne (id) {
		return Freelancers.findOneUser(id)
			.then((result) => _.omit(result, 'password', 'field_id', 'username'));
	},

	create (data) {
		return Freelancers.createUser(data);
	},

	createWithoutHash (data) {
		// calls the create method in the main Model
		return Freelancers.create(data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	update (id, data) {
		return Freelancers.updateById(id, data)
			.then((result) => _.omit(result, 'password', 'username'));
	},

	delete (id) {
		return Freelancers.delete(id);
	}

};
