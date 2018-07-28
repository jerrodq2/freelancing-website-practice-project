'use strict';


const Model = require('./flag_model');
const FlaggedFreelancers = new Model('flagged_freelancers');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	async create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.freelancer_id)
			throw Errors.badNull('flagged_freelancer', 'create', 'freelancer_id');
			
		return FlaggedFreelancers.createFlag(data, 'freelancer');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		return FlaggedFreelancers.findOne(id);
	},


	delete (id) {
		return FlaggedFreelancers.delete(id);
	}
};
