'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedJobs = require(`${process.cwd()}/src/models/saved_jobs`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Saved Jobs Model', () => {
	// data used to create the saved_job
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		data = { id, freelancer_id, job_id };

	// data used to create the freelancer and job, used in tests below
	const field_id = random.guid(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		title = random.word(),
		rate = random.integer({ min: 10, max: 100 }),
		rate_type = 'hourly',
		description = random.paragraph(),
		experience_level_requested = 'expert',

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name },

		jobData = { id: job_id, field_id, title, rate, rate_type, description, experience_level_requested };


	before(async() => {
		await db.resetTable('freelancers');
		await db.resetTable('jobs');
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.job(jobData);
		await random.saved_job(data);
	});


	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id and job_id', () => {

	});
});
