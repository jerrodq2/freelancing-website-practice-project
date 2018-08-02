'use strict';


const Model = require('./flag_model');
const FlaggedProposals = new Model('flagged_proposals');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.proposal_id)
			throw Errors.badNull('flagged_proposal', 'create', 'proposal_id');

		return FlaggedProposals.createFlag(data, 'proposal');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) { // TODO: will this work going through the flag_model? It doesn't have any freelancer_who_flagged fields, but maybe since it's a left join
		const proposalColumns = ['p.id as proposal_id', 'p.title as proposal_title', 'p.description as proposal_description'],
			joinText = ['proposals as p', 'flagged_proposals.proposal_id', 'p.id'];

		return FlaggedProposals.findOneFlag(id, proposalColumns, joinText);
	},


	delete (id) {
		return FlaggedProposals.delete(id);
	}
};
