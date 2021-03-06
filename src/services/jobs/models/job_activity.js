'use strict';


// This file creates the job_activity model
const knex = require(`${process.cwd()}/src/config/knex`);
const Model = require(`${process.cwd()}/src/services/main_model`);
const JobActivity = new Model('job_activity');
const Errors = require(`${process.cwd()}/src/lib/errors`);


// These variables are used in both getAll and findOne
const jobActivityColumns = ['job_activity.*'];
const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
const selectedColumns = jobActivityColumns.concat(jobColumns, freelancerColumns, clientColumns);


// TODO: determine when a job is added to a freelancer's job activity. Once accepted? Once finished? Update the tests accoridngly once determine, both the tests and mixins (section on specifying the data passed to create the job)
// this model doesn't have an update method, I don't see  any logical reason why a job_activity record would be updated, just deleted or created
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
	// TODO: be default, it orders them by created_at with the first created record being the zero index, should we allow different ordering? by client_id, created_at, etc? Would it be an option in the route, or would we pass it to the view like this and it can be rearranged there?
	// get all the job_activity for one user
	getAll (id) {
		return knex('job_activity')
			.select(selectedColumns)
			.where(knex.raw(`job_activity.freelancer_id = '${id}'`))
			.orderBy('created_at', 'asc')
			.innerJoin('jobs as j', 'job_activity.job_id', 'j.id')
			.innerJoin('freelancers as f', 'job_activity.freelancer_id', 'f.id')
			.innerJoin('clients as c', 'job_activity.client_id', 'c.id')
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('job_activity', 'getAll');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	findOne (id) {
		return knex('job_activity')
			.select(selectedColumns)
			.where(knex.raw(`job_activity.id = '${id}'`))
			.innerJoin('jobs as j', 'job_activity.job_id', 'j.id')
			.innerJoin('freelancers as f', 'job_activity.freelancer_id', 'f.id')
			.innerJoin('clients as c', 'job_activity.client_id', 'c.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('job_activity', 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('job_activity', 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	delete (id) {
		return JobActivity.delete(id);
	}
};
