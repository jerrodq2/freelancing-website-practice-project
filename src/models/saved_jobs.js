'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const SavedJobs = new Model('saved_jobs');
const Errors = require(`${process.cwd()}/src/lib/errors`);


// this model doesn't have an update method, seems more logical to simply allow them to delete and save another job than have to worry about updating anything. This model also doesn't go through the saved_user_model like saved clients/jobs due to the slight differences between the models, close code, but not as re-used, hence it would complicate the saved_user_model to include this in there
module.exports = {
	async create (data) {
		const { freelancer_id, job_id } = data,
			queryData = { freelancer_id, job_id };

		// first we check to see if this freelancer has already saved this client
		const check = await knex('saved_jobs').where(queryData)
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('saved_job', 'create');
				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull('saved_job', 'create', 'freelancer_id');
				// the cause of the error is most likely a missing job_id if this passes
				if (!job_id)
					throw Errors.badNull('saved_job', 'create', 'job_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		if (check[0]) {
			// if so, then we raise an exception, they can only save a job once
			const message = `The saved_job you are trying to create can't be completed. This freelancer has already saved the job: ${job_id}`;

			throw Errors.Boom.badRequest(message);
		}

		return SavedJobs.create(data);
	},


	getAll () {
		// TODO: Add in functionality to filter by job status, meaning a freelancer can see all of their saved jobs or just the ones that are not closed/still available
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
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('saved_job', 'find');

				return result[0];
			}).catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('saved_job', 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	delete (id) {
		return SavedJobs.delete(id);
	}
};
