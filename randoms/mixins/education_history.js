'use strict';


const random = new (require('chance'));
const EducationHistory = require(`${process.cwd()}/src/models/education_history`);

// used to create a random education_history. If given no parameters, randomizes all fields. A freelancer_id is required, for simplicity we don't create it here
module.exports = (opts = {}) => EducationHistory.create({
	id: opts.id || random.guid(),
	degree: opts.degree || random.word(),
	school: opts.school || random.company(),
	area_of_study: opts.area_of_study || random.word(),
	start_date: opts.start_date || random.date({ string: true }),
	end_date: opts.end_date || random.date({ string: true }),
	description: opts.description || random.paragraph(),
	freelancer_id: opts.freelancer_id,
});
