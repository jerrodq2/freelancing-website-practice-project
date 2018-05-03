'use strict';


const { format } = require('date-fns');
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const EducationHistory = require(`${process.cwd()}/src/models/education_history`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('education_history').del();
	// Inserts seed entries
	return Promise.all([
		EducationHistory.create({
			degree: 'Bachelors',
			school: 'Texas Tech University',
			area_of_study: 'IT',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.jerrod
		}),

		EducationHistory.create({
			degree: 'n/a',
			school: 'Coding Dojo',
			area_of_study: 'Full Stack Wev Development',
			start_date: format(new Date(2016, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2016, 12, 24), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.jerrod
		}),

		EducationHistory.create({
			degree: 'Masters',
			school: 'Texas Tech University',
			area_of_study: 'IT',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.ryan
		}),

		EducationHistory.create({
			degree: 'Bachelors',
			school: 'University Of North Texas',
			area_of_study: 'IT',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.jessica
		})
	]);
};
