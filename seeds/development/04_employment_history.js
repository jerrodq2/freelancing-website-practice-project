'use strict';


const { format } = require('date-fns');
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const EmploymentHistory = require(`${process.cwd()}/src/models/employment_history`);

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
			start_date: format(new Date(2015, 5, 1), 'YYYY-MM-DD'),
			end_date: format(new Date(2016, 1, 1), 'YYYY-MM-DD'),
			freelancer_id: freelancerIds.ryan
		}),
		EmploymentHistory.create({
			title: 'Front end developer',
			company: 'Verizon',
			start_date: format(new Date(2016, 2, 1), 'YYYY-MM-DD'),
			present_job: true,
			freelancer_id: freelancerIds.ryan
		}),
		EmploymentHistory.create({
			title: 'Database developer',
			company: 'CREF',
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
		})
	]);
};
