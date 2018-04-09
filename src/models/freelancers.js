'use strict';


const Model = require('./model');
const Freelancers = new Model('freelancers');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


module.exports = {

	getAll () {
		// to be setup with pagination later
	},

	findOne (id) {
		return Freelancers.findOneUser(id)
			.then((result) => _.omit(result, 'password', 'field_id', 'username'));
	},

	create (data) {
		// hash the password
		data.password = hashPassword(data.password);
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
