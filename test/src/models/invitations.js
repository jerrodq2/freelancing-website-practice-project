'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Invitations = require(`${process.cwd()}/src/models/invitations`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Invitations Model', () => {
	// roundDate is a simple function to round Javascript dates to the nearest day. When creating a new date with JS, it creates problems in the test, since the database rounds it to a day and saves it like that, so this eliminates that problem
	const today = new Date(),
		roundDate = (date) => {
			const offsetMs = date.getTimezoneOffset() * 60 * 1000, oneDayMs = 24 * 60 * 60 * 1000;
			return new Date(Math.floor((date.getTime() - offsetMs) / oneDayMs) * oneDayMs + offsetMs);
		};

	let requested_time_limit = new Date();
	// put the requested_time_limit to be two weeks from now
	requested_time_limit.setDate(today.getDate()+14);
	requested_time_limit = roundDate(requested_time_limit); // round it to be a day (no minutes, seconds, etc.), this is how it is saved in the db

	// These variables are used to create the invitation record
	const id = random.guid(),
		freelancer_id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(),
		title = random.word(),
		description = random.paragraph(),
		status = 'pending',
		data = { id, freelancer_id, job_id, client_id, title, description, requested_time_limit, status };

	// these variables are used to create the freelancer, client, and job, used in below tests for accuracy
	const field_id = random.guid(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),
		freelancer_job_title = random.word(),
		freelancer_experience_level = 'expert',
		client_first_name = random.name(),
		client_last_name = random.name(),
		job_title = random.word(),
		rate = random.integer({ min: 10, max: 100 }),
		rate_type = 'hourly',
		job_description = random.paragraph(),
		experience_level_requested = 'expert',

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name, job_title: freelancer_job_title, experience_level: freelancer_experience_level },

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		jobData = { id: job_id, title: job_title, rate, rate_type, description: job_description, experience_level_requested, client_id, freelancer_id, closed: 'false' };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.job(jobData);
		await random.invitation(data);
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


	describe('has cascading delete on freelancer_id, client_id, and job_id', () => {

	});
});
