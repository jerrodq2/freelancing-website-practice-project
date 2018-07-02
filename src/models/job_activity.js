'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const JobActivity = new Model('job_activity');
const Errors = require(`${process.cwd()}/src/lib/errors`);

// TODO: determine when a job is added to a freelancer's job activity. Once accepted? Once finished? Update the tests accoridngly once determine, both the tests and mixins (section on specifying the data passed to create the job)
module.exports = {
	async create (data) {
		const { freelancer_id, job_id } = data,
			query = { freelancer_id, job_id };

		// first we make sure that this freelancer doesn't already have a job_activity record with the given job_id
		const check = await knex('job_activity').where(query)
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('job_activity', 'create');
				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull('job_activity', 'create', 'freelancer_id');
				// the cause of the error is most likely a missing job_id if this passes
				if (!job_id)
					throw Errors.badNull('job_activity', 'create', 'job_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});


		if (check[0]) {
			// if this passes, then this freelancer already has this job in his job_activity so we raise an exception
			const message = `The job_activity you are trying to create can't be completed. This freelancer has already saved the job: ${job_id}`;

			throw Errors.Boom.badRequest(message);
		}

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
