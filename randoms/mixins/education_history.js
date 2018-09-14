'use strict';


const random = new (require('chance'));
const EducationHistory = require(`${process.cwd()}/src/services/freelancer_history/models/education_history`);

// used to create a random education_history. If given no parameters, randomizes all fields
module.exports = async(opts = {}) => {
	// if the needed foreign keys aren't given, we create them here
	if (!opts.freelancer_id) {
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id });
	}


	return EducationHistory.create({
		id: opts.id || random.guid(),
		degree: opts.degree || random.word(),
		school: opts.school || random.company(),
		area_of_study: opts.area_of_study || random.word(),
		start_date: opts.start_date || random.date({ string: true }),
		end_date: opts.end_date || random.date({ string: true }),
		currently_attending: opts.currently_attending == undefined? random.bool() : opts.currently_attending,
		description: opts.description || random.paragraph(),
		freelancer_id: opts.freelancer_id,
	});
};
