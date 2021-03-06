'use strict';


// This file creates the jobs model with the standard methods
const knex = require(`${process.cwd()}/src/config/knex`);
const Model = require(`${process.cwd()}/src/services/main_model`);
const Jobs = new Model('jobs');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {

	getAll () {
		// TODO: to be setup with pagination later
		// TODO: Need to add testing if I keep this as is
		return knex.table('jobs').select();
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
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('job', 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('job', 'find');

				// if the cause of the error wasn't found, throw the error
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
