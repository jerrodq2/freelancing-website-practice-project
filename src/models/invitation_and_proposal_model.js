'use strict';


const MainModel = require('./main_model');
const knex = require('../config/knex');
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// a specific class that extends the MainModel, used only for the invitations and proposals model, to abstract re-used code and improe DRYness
class InvitationAndProposalModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	async createInvitation () {

	}
}

module.exports = InvitationAndProposalModel;
