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
			description: 'Good school',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.jerrod
		}),

		EducationHistory.create({
			degree: 'n/a',
			school: 'Coding Dojo',
			area_of_study: 'Full Stack Wev Development',
			description: 'Coding Bootcamp that teaches 3 full stacks',
			start_date: format(new Date(2016, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2016, 12, 24), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.jerrod
		}),

		EducationHistory.create({
			degree: 'Masters',
			school: 'Texas Tech University',
			area_of_study: 'IT',
			description: 'Great campus',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.ryan
		}),

		EducationHistory.create({
			degree: 'N/A',
			school: 'Hack Reactor',
			area_of_study: 'IT',
			description: 'Amazing coding bootcamp',
			start_date: format(new Date(2018, 1, 1), 'YYYY-MM-DD'),
			currently_attending: true,
			freelancer_id: freelancerIds.ryan
		}),

		EducationHistory.create({
			degree: 'Bachelors',
			school: 'University Of North Texas',
			area_of_study: 'Systems Administration',
			description: 'Joined the honor society',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.jessica
		}),

		EducationHistory.create({
			degree: 'Bachelors',
			school: 'Konoha - Ninja Academy',
			area_of_study: 'n/a',
			description: 'A pain but got my degree',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.naruto
		}),

		EducationHistory.create({
			degree: 'Associates',
			school: 'Devry University',
			area_of_study: 'Computer Science and Programming',
			start_date: format(new Date(2011, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2015, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.ichigo
		}),

		EducationHistory.create({
			degree: 'Masters',
			school: 'UA Academy',
			area_of_study: 'IT',
			description: 'Taught me the essentails of the IT field, also where I chose the hero name deku',
			start_date: format(new Date(2005, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2009, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.izuku
		}),

		EducationHistory.create({
			degree: 'Bachelors',
			school: 'New York University',
			area_of_study: 'Art History',
			description: '',
			start_date: format(new Date(2002, 8, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2006, 3, 1), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.leon
		}),

		EducationHistory.create({
			degree: 'Certification',
			school: 'Hack Reactor',
			area_of_study: 'IT',
			description: 'Prestigous tech school',
			start_date: format(new Date(2012, 5, 17), 'YYYY-MM-DD'),
			end_date: format(new Date(2012, 9, 20), 'YYYY-MM-DD'),
			currently_attending: false,
			freelancer_id: freelancerIds.leon
		}),
	]);
};
