'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const JobActivity = require(`${process.cwd()}/src/models/job_activity`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Job Activity Model', () => {
	// These variables are used to create the job_activity record
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(),
		data = { id, freelancer_id, job_id, client_id };

	// these variables are used to create the freelancer, client, and job, used in below tests for accuracy
	const field_id = random.guid(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		title = random.word(),
		rate = random.integer({ min: 10, max: 100 }),
		rate_type = 'hourly',
		description = random.paragraph(),
		experience_level_requested = 'expert',

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name },

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		jobData = { id: job_id, title, rate, rate_type, description, experience_level_requested, client_id, freelancer_id };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.job(jobData);
		await random.job_activity(data);
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


	describe('has cascading delete on job_id, freelancer_id, and client_id', () => {

	});
});
