'use strict';


const Model = require('./main_model');
const FlaggedFreelancers = new Model('flagged_freelancers');


module.exports = {
	// TODO: determine if we need two different methods for the flag being created by the client and by the freelancer. Perhaps it is only one create method, and which parameter (client_who_flagged/freelancer_who_flagged)is sent is determineded in the route
	create (data) {
		return FlaggedFreelancers.create(data);
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
