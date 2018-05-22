'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Invitations = new Model('invitations');


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
	},
	findOne (id) {
		// specify the columns I want from each table
		const invitationsColumns = ['invitations.*' ];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', ' c.last_name as clients_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = invitationsColumns.concat(jobColumns, clientColumns, freelancerColumns);
		return knex('invitations')
			.select(selectedColumns)
			.where(knex.raw(`invitations.id = '${id}'`))
			.innerJoin('jobs as j', 'invitations.job_id', 'j.id')
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
