'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Proposals = new Model('proposals');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	// TODO: make sure a job is still open before create, has to be available otherwise there's no point in the proposal. Send message like "job closed, no longer accepting proposals"
	async create (data) {
		const { job_id, freelancer_id } = data;

		// first we make sure the job is still open/not closed
		const check_job = await knex('jobs').where({ id: job_id })
			.then((job) => {
				// throw error if the job with the given id couldn't be found
				if (!job[0]) throw Errors.badForeignKey('proposal', 'create', 'job_id');

				return job[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('proposal', 'find');
				// the cause of the error is most likely a missing job_id if this passes
				if (!job_id)
					throw Errors.badNull('proposal', 'create', 'job_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
		// if the job is closed, we raise an exception
		if (check_job.closed) {
			const message = 'The proposal you were trying to create can\'t be completed, this job is closed';

			throw Errors.Boom.badRequest(message);
		}

		// next we check to see if this freelancer has already written a proposal for this job
		const check_freelancer = await knex('proposals').where({ job_id, freelancer_id })
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('proposal', 'find');
				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull('proposal', 'create', 'freelancer_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		if (check_freelancer[0]) {
			const message = 'The proposal you were trying to create can\'t be completed, this freelancer has already written a proposal for this job';

			throw Errors.Boom.badRequest(message);
		}

		return Proposals.create(data);
	},


	// TODO: Perhaps different methods? One for clients who want to see all of the proposals for a job and one for freelancers who want to see all of the proposals. One for rejected, pending, and accepted proposals?
	getAll () {
		// TODO: to be setup with pagination later
	},


	findOne (id) {
		// specify the columns I want from each table
		const proposalsColumns = ['proposals.*' ];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', ' c.last_name as client_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = proposalsColumns.concat(jobColumns, clientColumns, freelancerColumns);
		return knex('proposals')
			.select(selectedColumns)
			.where(knex.raw(`proposals.id = '${id}'`))
			.innerJoin('jobs as j', 'proposals.job_id', 'j.id')
			.innerJoin('clients as c', 'proposals.client_id', 'c.id')
			.innerJoin('freelancers as f', 'proposals.freelancer_id', 'f.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('proposal', 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('proposal', 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	// TODO: don't allow the freelancer_id, client_id, or job_id to be updated, prevent in the route, probably with JOI
	update (id, data) {
		return Proposals.updateById(id, data);
	},


	delete (id) {
		return Proposals.delete(id);
	}

};
