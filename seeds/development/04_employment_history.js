'use strict';


// This file seeds the database with employment history for the already inserted freelancers
const { format } = require('date-fns');
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const EmploymentHistory = require(`${process.cwd()}/src/services/freelancer_history/models/employment_history`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('employment_history').del();

	// Inserts seed entries
	return Promise.all([
		EmploymentHistory.create({
			title: 'solutions engineer',
			company: 'Think Smart',
			start_date: format(new Date(2017, 1, 1), 'YYYY-MM-DD'),
			present_job: true,
			summary: 'worked an amazing job at an amazing company',
			freelancer_id: freelancerIds.jerrod
		}),

		EmploymentHistory.create({
			title: 'Front end developer',
			company: 'Google',
			summary: 'Greatest job i\'ve ever had...',
			start_date: format(new Date(2015, 5, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2016, 1, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.ryan
		}),

		EmploymentHistory.create({
			title: 'Front end developer',
			company: 'Verizon',
			summary: 'Was secondary team lead',
			start_date: format(new Date(2016, 2, 1), 'YYYY-MM-DD'),
			present_job: true,
			freelancer_id: freelancerIds.ryan
		}),

		EmploymentHistory.create({
			title: 'Database developer',
			company: 'CREF',
			summary: 'worked entirely in database',
			start_date: format(new Date(2017, 5, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2018, 2, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.jessica
		}),

		EmploymentHistory.create({
			title: 'Hokage',
			company: 'Konoha',
			start_date: format(new Date(2011, 6, 1), 'YYYY-MM-DD'),
			present_job: true,
			summary: 'protecting konoha from the akatsuki, madara, and of course, sasukes shenanigans',
			freelancer_id: freelancerIds.naruto
		}),

		EmploymentHistory.create({
			title: 'IT Team Lead',
			company: 'Apple',
			summary: 'worked',
			start_date: format(new Date(2009, 4, 15), 'YYYY-MM-DD'),
			present_job: true,
			freelancer_id: freelancerIds.izuku
		}),

		EmploymentHistory.create({
			title: 'Art Teacher',
			company: 'NY School District',
			summary: 'Worked as a teach for 6 years, decided I wanted a more challenging and fulilling career',
			start_date: format(new Date(2006, 4, 23), 'YYYY-MM-DD'),
			end_date: format(new Date(2012, 5, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.leon
		}),

		EmploymentHistory.create({
			title: 'Javascript Develoepr',
			company: 'BSAA',
			summary: 'n/a',
			start_date: format(new Date(2012, 12, 10), 'YYYY-MM-DD'),
			present_job: true,
			freelancer_id: freelancerIds.leon
		}),
	]);
};
