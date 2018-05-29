'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Jobs = new Model('jobs');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
	},


	create (data) {
		return Jobs.create(data);
	},


	findOne (id) {
		// specify the columns I want from each table
		const jobColumns = ['jobs.*' ];
		const fieldColumns = ['fields.field'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', ' c.last_name as client_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = jobColumns.concat(fieldColumns, clientColumns, freelancerColumns);
		return knex('jobs')
			.select(selectedColumns)
			.where(knex.raw(`jobs.id = '${id}'`))
			.innerJoin('fields', 'jobs.field_id', 'fields.id')
			.innerJoin('clients as c', 'jobs.client_id', 'c.id')
			.innerJoin('freelancers as f', 'jobs.freelancer_id', 'f.id')
			.then((array) => {
				// In the event of no record found, we still return an empty object for consistency
				const result = array[0] ? array[0] : {};
				return result;
			})
			.catch((err) => {
				// check if id is in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('jobs', 'findOne');

				// if the cause of the error wasn't found above, throw the error
				throw err;
			});
	},


	update (id, data) {
		return Jobs.updateById(id, data);
	},


	delete (id) {
		return Jobs.delete(id);
	}

};
