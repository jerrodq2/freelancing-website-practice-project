'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const jobActivity = new Model('job_activity');


module.exports = {
	// get all the job_activity for one user
	getAll (id) {
		const jobActivityColumns = ['job_activity.*'];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const selectedColumns = jobActivityColumns.concat(jobColumns, clientColumns);
		return knex('job_activity')
			.select(selectedColumns)
			.where(knex.raw(`job_activity.freelancer_id = '${id}'`))
			.innerJoin('jobs as j', 'job_activity.job_id', 'j.id')
			.innerJoin('clients as c', 'job_activity.client_id', 'c.id');
	},
	// may make adjustments to include the joins used above
	findOne (id) {
		return jobActivity.findOne(id);
	},

	create (data) {
		return jobActivity.create(data);
	},

	update (id, data) {
		return jobActivity.updateById(id, data);
	},

	delete (id) {
		return jobActivity.delete(id);
	}

};
