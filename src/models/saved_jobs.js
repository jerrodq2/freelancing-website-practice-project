'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const SavedJobs = new Model('saved_jobs');


module.exports = {


	getAll () {
		// TODO: to be setup with pagination later
	},

	findOne (id) {
		const savedJobsColumns = ['saved_jobs.*'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const selectedColumns = savedJobsColumns.concat(freelancerColumns, jobColumns);
		return knex('saved_jobs')
			.select(selectedColumns)
			.where(knex.raw(`saved_jobs.id = '${id}'`))
			.innerJoin('freelancers as f', 'saved_jobs.freelancer_id', 'f.id')
			.innerJoin('jobs as j', 'saved_jobs.job_id', 'j.id')
			.then((result) => result[0]);
	},

	create (data) {
		return SavedJobs.create(data);
	},

	update (id, data) {
		return SavedJobs.updateById(id, data);
	},

	delete (id) {
		return SavedJobs.delete(id);
	}

};
