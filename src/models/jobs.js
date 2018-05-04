'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const Jobs = new Model('jobs');


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
	},

	findOne (id) {
		// specify the columns I want from each table
		const jobColumns = ['jobs.*' ];
		const fieldColumns = ['fields.field'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', ' c.last_name as clients_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = jobColumns.concat(fieldColumns, clientColumns, freelancerColumns);
		return knex('jobs')
			.select(selectedColumns)
			.where(knex.raw(`jobs.id = '${id}'`))
			.innerJoin('fields', 'jobs.field_id', 'fields.id')
			.innerJoin('clients as c', 'jobs.client_id', 'c.id')
			.innerJoin('freelancers as f', 'jobs.freelancer_id', 'f.id')
			.then((result) => result[0]);
	},

	create (data) {
		return Jobs.create(data);
	},

	update (id, data) {
		return Jobs.updateById(id, data);
	},

	delete (id) {
		return Jobs.delete(id);
	}

};
