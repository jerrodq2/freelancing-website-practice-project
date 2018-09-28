'use strict';


// This file creates the flagged_invitations model as a new instance of the flag_model
const Model = require('./flag_model');
const FlaggedInvitations = new Model('flagged_invitations');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.invitation_id)
			throw Errors.badNull('flagged_invitation', 'create', 'invitation_id');

		return FlaggedInvitations.createFlag(data, 'invitation');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		const invitationColumns = ['i.id as invitation_id', 'i.title as invitation_title', 'i.description as invitation_description'],
			joinText = ['invitations as i', 'flagged_invitations.invitation_id', 'i.id'];

		return FlaggedInvitations.findOneInvitation(id, invitationColumns, joinText, 'freelancer');
	},


	delete (id) {
		return FlaggedInvitations.delete(id);
	}
};
