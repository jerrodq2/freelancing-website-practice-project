'use strict';


const random = new (require('chance'));
const EmploymentHistory = require(`${process.cwd()}/src/models/employment_history`);

// used to create a random employment_history. If given no parameters, randomizes all fields.
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
