'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FlaggedJobs = require(`${process.cwd()}/src/models/flagged_jobs`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Flagged Jobs Model', () => {
	// create the first flag as a freelancer flagging a job
	const id = random.guid(),
		job_id = random.guid(),
		client_id = random.guid(), // the client who creates any job that is flagged, saves us having to create a client for each one
		client_who_flagged = random.guid(),
		freelancer_who_flagged = random.guid(),
		reason = random.sentence(),
		field_id = random.guid(),
		data = { id, job_id, freelancer_who_flagged, reason };

	// variables used to specify fields of the clients and freelancer, used in the tests below
	const title = random.sentence(),
		description = random.paragraph(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		jobData = { id: job_id, field_id, title, description },

		clientData = { id: client_who_flagged, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_who_flagged, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };


	before(async() => {
		await db.resetAll();
		await random.field({ id: field_id });
		await random.job(jobData);
		await random.client({ id: client_id, field_id });
		await random.client(clientData);
		await random.freelancer(freelancerData);
		await random.flagged_job(data);
	});

	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on job_id, client_who_flagged, and freelancer_who_flagged', () => {

	});
});
