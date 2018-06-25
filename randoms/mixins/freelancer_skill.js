'use strict';


const random = new (require('chance'));
const FreelancerSkills = require(`${process.cwd()}/src/models/freelancer_skills`);

// used to create a random freelancer_skill. If given no parameters, randomizes all fields
module.exports = async(opts = {}) => {
	// if the needed foreign keys aren't given, we create them here
	if (!opts.freelancer_id) {
		opts.freelancer_id = random.guid();
		await random.freelancer({ id: opts.freelancer_id });
	}

	if (!opts.skill_id) {
		opts.skill_id = random.guid();
		await random.skill({ id: opts.skill_id });
	}


	return FreelancerSkills.create({
		id: opts.id || random.guid(),
		freelancer_id: opts.freelancer_id,
		skill_id: opts.skill_id,
		skill_alias: opts.skill_alias || random.word(),
	});
};
