'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const JobActivity = new Model('job_activity');

// TODO: determine when a job is added to a freelancer's job activity. Once accepted? Once finished? Update the tests accoridngly once determine, both the tests and mixins (section on specifying the data passed to create the job)
module.exports = {
	create (data) {
		return JobActivity.create(data);
	},


	// TODO: add pagination to the job_activity getAll?
	// get all the job_activity for one user
	getAll (id) {
		const jobActivityColumns = ['job_activity.*'];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const selectedColumns = jobActivityColumns.concat(jobColumns, freelancerColumns, clientColumns);
		return knex('job_activity')
			.select(selectedColumns)
			.where(knex.raw(`job_activity.freelancer_id = '${id}'`))
			.innerJoin('jobs as j', 'job_activity.job_id', 'j.id')
			.innerJoin('freelancers as f', 'job_activity.freelancer_id', 'f.id')
			.innerJoin('clients as c', 'job_activity.client_id', 'c.id');
	},


	// TODO: may make adjustments to include the joins used above
	findOne (id) {
		return JobActivity.findOne(id);
	},


	update (id, data) {
		return JobActivity.updateById(id, data);
	},


	delete (id) {
		return JobActivity.delete(id);
	}
};
