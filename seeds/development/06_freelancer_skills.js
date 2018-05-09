'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const FreelancerSkills = require(`${process.cwd()}/src/models/freelancer_skills`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('freelancer_skills').del();
	// Inserts seed entries
	return Promise.all([
		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill_id: ,
		}),

	]);
};
