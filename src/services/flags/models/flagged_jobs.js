'use strict';


// This file creates the flagged_jobs model as a new instance of the flag_model
const Model = require('./flag_model');
const FlaggedJobs = new Model('flagged_jobs');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.job_id)
			throw Errors.badNull('flagged_job', 'create', 'job_id');

		return FlaggedJobs.createFlag(data, 'job');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		const jobColumns = ['j.id as job_id', 'j.title as job_title', 'j.description as job_description'],
			joinText = ['jobs as j', 'flagged_jobs.job_id', 'j.id'];

		return FlaggedJobs.findOneFlag(id, jobColumns, joinText);
	},


	delete (id) {
		return FlaggedJobs.delete(id);
	}
};
