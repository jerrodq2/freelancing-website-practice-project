'use strict';


// This file creates the invitations model as a new instance of the invitation_and_proposal_model
const Model = require('./invitation_and_proposal_model');
const Invitations = new Model('invitations');


module.exports = {
	create (data) {
		return Invitations.createInvitation(data, 'invitation');
	},


	// TODO: Perhaps different methods? One for clients who want to see all of the invitations for a job and one for freelancers who want to see all of the invitations they've been sent. One for rejected, pending, and accepted invitations?
	getAll () {
		// TODO: to be setup with pagination later
	},


	findOne (id) {
		return Invitations.findOneInvitation(id);
	},


	update (id, data) {
		return Invitations.updateById(id, data);
	},


	delete (id) {
		return Invitations.delete(id);
	}
};
