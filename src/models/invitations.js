'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Invitations = new Model('invitations');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	async create (data) {
		const { job_id, client_id, freelancer_id } = data;

		// first we make sure the job is still open/not closed
		const check_job = await knex('jobs').where({ id: job_id })
			.then((job) => {
				// throw error if the job with the given id couldn't be found
				if (!job[0]) throw Errors.badForeignKey('invitation', 'create', 'job_id');

				return job[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('invitation', 'find');
				// the cause of the error is most likely a missing job_id if this passes
				if (!job_id)
					throw Errors.badNull('invitation', 'create', 'job_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
		// if the job is closed, we raise an exception
		if (check_job.closed) {
			const message = 'The invitation you were trying to create can\'t be completed, this job is closed';

			throw Errors.Boom.badRequest(message);
		}

		// next we check to see if this client has already written an invitation to this freelancer for this job
		const check_client = await knex('invitations').where({ client_id, job_id, freelancer_id })
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('invitation', 'find');
				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull('invitation', 'create', 'freelancer_id');
				// the cause of the error is most likely a missing client_id if this passes
				if (!client_id)
					throw Errors.badNull('invitation', 'create', 'client_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		// if the client has already written an invitation to this freelancer for this job, we raise an exception
		if (check_client[0]) {
			const message = 'The invitation you were trying to create can\'t be completed, this client has already written an invitation to this freelancer for this job';

			throw Errors.Boom.badRequest(message);
		}

		return Invitations.create(data);
	},


	// TODO: Perhaps different methods? One for clients who want to see all of the invitations for a job and one for freelancers who want to see all of the invitations they've been sent. One for rejected, pending, and accepted invitations?
	getAll () {
		// TODO: to be setup with pagination later
	},


	findOne (id) {
		// specify the columns I want from each table
		const invitationsColumns = ['invitations.*' ];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', ' c.last_name as client_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = invitationsColumns.concat(jobColumns, clientColumns, freelancerColumns);
		return knex('invitations')
			.select(selectedColumns)
			.where(knex.raw(`invitations.id = '${id}'`))
			.innerJoin('jobs as j', 'invitations.job_id', 'j.id')
			.innerJoin('clients as c', 'invitations.client_id', 'c.id')
			.innerJoin('freelancers as f', 'invitations.freelancer_id', 'f.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('invitation', 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('invitation', 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	update (id, data) {
		return Invitations.updateById(id, data);
	},


	delete (id) {
		return Invitations.delete(id);
	}
};
