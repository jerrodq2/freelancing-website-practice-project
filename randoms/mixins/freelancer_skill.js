'use strict';


// This file is used to create a random freelancer_skill record for testing. If given no parameters, randomizes all fields
const random = new (require('chance'));
const FreelancerSkills = require(`${process.cwd()}/src/services/skills/models/freelancer_skills`);


module.exports = async(opts = {}) => {
	// if the needed keys aren't given, we create them here
	if (!opts.freelancer_id) {
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id });
	}

	// we give the name of a skill, and it is created if necessary in the model
	if (!opts.skill) {
		opts.skill = random.word();
		await random.skill({ skill: opts.skill });
	}


	return FreelancerSkills.create({
		id: opts.id || random.guid(),
		freelancer_id: opts.freelancer_id,
		skill: opts.skill,
	});
};
