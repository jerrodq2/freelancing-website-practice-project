'use strict';


const Model = require('./main_model');
const FlaggedInvitations = new Model('flagged_invitations');


module.exports = {
	// TODO: determine if we need two different methods for the flag being created by the client and by the freelancer. Perhaps it is only one create method, and which parameter (client_who_flagged/freelancer_who_flagged)is sent is determineded in the route
	create (data) {
		return FlaggedInvitations.create(data);
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		return FlaggedInvitations.findOne(id);
	},


	delete (id) {
		return FlaggedInvitations.delete(id);
	}
};
