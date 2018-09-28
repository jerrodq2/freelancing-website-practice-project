'use strict';


// This file creates the review_model, which extends the main_model with specifc methods that are used by the freelancer_review and client_review models
const MainModel = require(`${process.cwd()}/src/services/main_model`);
const Jobs = require(`${process.cwd()}/src/services/jobs/models/jobs`);
const knex = require(`${process.cwd()}/src/config/knex`);
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);


// A specific class that extends the MainModel, used only for reviews (client_review and freelancer_review), to abstract re-used code and improve DRYness
class ReviewModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	async createReview (data) {
		const { job_id } = data;
		const job = await Jobs.findOne(job_id);

		// the job must be finished to write a review about it, aka: closed must be true
		if (!job.closed) {
			const message = `You can't write a ${this.tableName} about this job, it hasn't been completed yet.`;

			throw Errors.Boom.badRequest(message);
		}

		return this.create(data);
	}


	// find a single client or freelancer review, grabs relevant infor about the job, client, and freelancer
	findReview (id) {
		const mainColumns = [`${this.tableName}.*`];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.rate as job_rate', 'j.rate_type as job_rate_type', 'j.description as job_description', 'j.experience_level_requested as job_experience_level_requested'];

		const selectedColumns = mainColumns.concat(clientColumns, freelancerColumns, jobColumns);
		return knex(this.tableName)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			.innerJoin('clients as c', `${this.tableName}.client_id`, 'c.id')
			.innerJoin('freelancers as f', `${this.tableName}.freelancer_id`, 'f.id')
			.innerJoin('jobs as j', `${this.tableName}.job_id`, 'j.id')
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


	// get all of the reviews written about a specific freelancer/client
	getAllReviews () {
		// TODO: setup later with pagination, main code goes in this model, update client/freelancer review models to hit this method, add to tests after
	}


	// get all of the reviews written by a specific client/freelancer
	getAll () {
		// TODO: setup later with pagination, main code goes in this model, update client/freelancer review models to hit this method, add to tests after
	}


	// TODO: Should you be able to update the job, client, or freelancer of a review? Currently not testing for it, maybe just restrict the object keys during the route with joy to ensure you can't update those three fields? If so, both reviews will go through this model, so write the code her and update those models and tests accordingly. If not, then I can remove this method as it just currently sends to the main model
	update (id, data) {
		return this.updateById(id, data);
	}
}


module.exports = ReviewModel;
