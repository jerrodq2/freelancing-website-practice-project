'use strict';


// This file is used to create a random employment_history record for testing. If given no parameters, randomizes all fields.
const random = new (require('chance'));
const EmploymentHistory = require(`${process.cwd()}/src/services/freelancer_history/models/employment_history`);


module.exports = async(opts = {}) => {
	// if the needed foreign keys aren't given, we create them here
	if (!opts.freelancer_id) {
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id });
	}


	return EmploymentHistory.create({
		id: opts.id || random.guid(),
		title: opts.title || random.word(),
		company: opts.company || random.company(),
		start_date: opts.start_date || random.date({ string: true }),
		end_date: opts.end_date || random.date({ string: true }),
		present_job: opts.present_job == undefined? random.bool() : opts.present_job,
		summary: opts.summary || random.paragraph(),
		freelancer_id: opts.freelancer_id,
	});
};
