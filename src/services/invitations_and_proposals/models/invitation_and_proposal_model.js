'use strict';


// This file creates the invitation_and_proposal_model, which extends the main_model with specifc methods that are used by the inivtation and proposal models
const MainModel = require(`${process.cwd()}/src/services/main_model`);
const knex = require(`${process.cwd()}/src/config/knex`);
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);


// a specific class that extends the MainModel, used only for the invitations and proposals model, to abstract re-used code and improve DRYness
class InvitationAndProposalModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	// Used in both create methods below, it checks if the job you're trying to create a proposal/invitation for exists, then if it is open
	async checkJobIsOpen (job_id) {
		// first we query for the job
		const check_job = await knex('jobs').where({ id: job_id })
			.then((job) => {
				// throw error if the job with the given id couldn't be found
				if (!job[0]) throw Errors.badForeignKey(toSingular(this.tableName), 'create', 'job_id');

				return job[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');
				// the cause of the error is most likely a missing job_id if this passes
				if (!job_id)
					throw Errors.badNull(toSingular(this.tableName), 'create', 'job_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
		// now we make sure the job is still open/not closed. If the job is closed, we raise an exception
		if (check_job.closed) {
			const message = `The ${toSingular(this.tableName)} you were trying to create can't be completed, this job is closed`;

			throw Errors.Boom.badRequest(message);
		}
	}


	async createInvitation (data, modelType = 'proposal') {
		const { job_id, freelancer_id, client_id } = data;

		// this message is used in the error message below and differs based on if the model is a proposal or inivtation accordingly
		let specificMessage;
		if (modelType === 'proposal') {
			specificMessage = 'this freelancer has already written a proposal for this job';
		} else {
			specificMessage = 'this client has already written an invitation to this freelancer for this job';
		}

		// first we check if the job is even open
		await this.checkJobIsOpen(job_id);

		// next we check to see if this user (freelancer or client) has already written a proposal/invitation for this job
		const check_freelancer = await knex(this.tableName).where({ job_id, freelancer_id })
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');
				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull(toSingular(this.tableName), 'create', 'freelancer_id');

				// check if a missing client_id caused the error, but since only the invitation model passes the client_id, we check which model we're dealing with
				if (modelType === 'invitation') {
					if (!client_id)
						throw Errors.badNull(toSingular(this.tableName), 'create', 'client_id');
					// if the cause of the error wasn't found above, throw the given error
				}

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		// if the user (freelancer or client) has already written a proposal/invitation for this job, we raise an exception
		if (check_freelancer[0]) {
			const message = `The ${toSingular(this.tableName)} you were trying to create can't be completed, ${specificMessage}`;

			throw Errors.Boom.badRequest(message);
		}

		return this.create(data);
	}


	findOneInvitation (id) {
		// specify the columns I want from each table
		const invitationsColumns = [`${this.tableName}.*` ];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', ' c.last_name as client_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name', 'f.job_title as freelancer_job_title', 'f.experience_level as freelancer_experience_level'];

		const selectedColumns = invitationsColumns.concat(jobColumns, clientColumns, freelancerColumns);
		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			.innerJoin('jobs as j', `${this.tableName}.job_id`, 'j.id')
			.innerJoin('clients as c', `${this.tableName}.client_id`, 'c.id')
			.innerJoin('freelancers as f', `${this.tableName}.freelancer_id`, 'f.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}
}

module.exports = InvitationAndProposalModel;
