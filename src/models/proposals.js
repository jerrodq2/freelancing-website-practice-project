'use strict';


const Model = require('./invitation_and_proposal_model');
const Proposals = new Model('proposals');


module.exports = {
	create (data) {
		return Proposals.createProposal(data);
	},


	// TODO: Perhaps different methods? One for clients who want to see all of the proposals for a job and one for freelancers who want to see all of the proposals. One for rejected, pending, and accepted proposals?
	getAll () {
		// TODO: to be setup with pagination later
	},


	findOne (id) {
		return Proposals.findOneInvitation(id);
	},


	// TODO: don't allow the freelancer_id, client_id, or job_id to be updated, prevent in the route, probably with JOI
	update (id, data) {
		return Proposals.updateById(id, data);
	},


	delete (id) {
		return Proposals.delete(id);
	}

};
