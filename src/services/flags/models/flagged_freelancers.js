'use strict';


// This file creates the flagged_freelancers model as a new instance of the flag_model
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
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'],
			joinText = ['freelancers as f', 'flagged_freelancers.freelancer_id', 'f.id'];

		return FlaggedFreelancers.findOneFlag(id, freelancerColumns, joinText);
	},


	delete (id) {
		return FlaggedFreelancers.delete(id);
	}
};
