'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const Invitations = new Model('invitations');


module.exports = {

	getAll () {
		// to be setup with pagination later
	},
	findOne (id) {
		// specify the fields I want from each table
		const invitationsColumns = ['invitations.*' ];
		const clientColumns = ['c.first_name as client_first_name', ' c.last_name as clients_last_name'];
		const freelancerColumns = ['f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = invitationsColumns.concat(clientColumns, freelancerColumns);
		return knex('invitations')
			.select(selectedColumns)
			.where(knex.raw(`invitations.id = '${id}'`))
			.innerJoin('clients as c', 'invitations.client_id', 'c.id')
			.innerJoin('freelancers as f', 'invitations.freelancer_id', 'f.id')
			.then((result) => result[0]);
	},

	create (data) {
		return Invitations.create(data);
	},

	update (id, data) {
		return Invitations.updateById(id, data);
	},

	delete (id) {
		return Invitations.delete(id);
	}

};
