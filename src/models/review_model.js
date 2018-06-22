'use strict';


const MainModel = require('./main_model');
const knex = require('../config/knex');
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// A specific class that extends the MainModel, used only for review (client_review and freelancer_review), to abstract re-used code and improve DRYness
class ReviewModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	createReview (data) {
		const { job_id } = data;
		const job = await Jobs.findOne(job_id);

		// the job must be finished to write a review about it, aka: closed must be true
		if (job.closed === false) {
			const message = 'You can\'t write a freelancer_review about this job, it hasn\'t been completed yet.';

			throw Boom.badRequest(message);
		}
		return FreelancerReviews.create(data);

	}
}


module.exports = ReviewModel;
