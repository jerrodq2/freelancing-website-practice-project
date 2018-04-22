'use strict';


const Model = require('./model');
const Inappropriate_flags = new Model('inappropriate_flags');


module.exports = {
	// May have to create specific methods for flags about freelancers, clients, jobs, etc. This way it will be a little more consisten on what tables get joined and for what queries


	getAll () {
		// to be setup with pagination later, most likely only for admins
	},

	// To be updated later, will mostly likely have to create a specific method to deal with all of the joins and determine what tables need to be joined
	findOne (id) {
		return Inappropriate_flags.findOne(id);
	},

	create (data) {
		return Inappropriate_flags.create(data);
	},

	update (id, data) {
		return Inappropriate_flags.updateById(id, data);
	},

	delete (id) {
		return Inappropriate_flags.delete(id);
	}

};
