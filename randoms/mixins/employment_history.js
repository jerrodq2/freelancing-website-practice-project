'use strict';


const random = new (require('chance'));
const EmploymentHistory = require(`${process.cwd()}/src/models/employment_history`);

// used to create a random employment_history. If given no parameters, randomizes all fields. A freelancer_id is required, for simplicity we don't create them here
module.exports = (opts = {}) => EmploymentHistory.create({
	id: opts.id || random.guid(),
	title: opts.title || random.word(),
	company: opts.company || random.company(),
	start_date: opts.start_date || random.date({ string: true }),
	end_date: opts.end_date || random.date({ string: true }),
	present_job: opts.present_job == undefined? random.bool() : opts.present_job,
	summary: opts.summary || random.paragraph(),
	freelancer_id: opts.freelancer_id,
});
