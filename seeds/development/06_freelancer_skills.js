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
			skill: 'MEAN',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'NodeJS',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'HTML',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'CSS',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'Bootstrap',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'jQuery',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'Ruby on Rails',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'Python',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'MongoDB',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'MySQL',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'AngularJS',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'Django',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'Wordpress',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jerrod,
			skill: 'Swift',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.ryan,
			skill: 'html',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.ryan,
			skill: 'css',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.ryan,
			skill: 'worpress',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.ryan,
			skill: 'bootstrap',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.jessica,
			skill: 'Database',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.naruto,
			skill: 'wordpress',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.naruto,
			skill: 'php',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.leon,
			skill: 'qa',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.leon,
			skill: 'JS',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.dick,
			skill: 'front end',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.dick,
			skill: 'back end',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.dick,
			skill: 'html',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.dick,
			skill: 'CSS',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.dick,
			skill: 'JavaScript',
		}),

		FreelancerSkills.create({
			freelancer_id: freelancerIds.dick,
			skill: 'database',
		}),

	]);
};
