'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FreelancerReviews = require(`${process.cwd()}/src/models/freelancer_reviews`);
const { db, random, knex, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Freelancer Reviews Model', () => {
	const id = random.guid(),
		rating = random.integer({ min: 0, max: 5 }),
		review = random.paragraph(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		job_id = random.guid(),
		field_id = random.guid(),
		data = { id, rating, review, freelancer_id, client_id, job_id };

	before(async() => {
		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client({ id: client_id, field_id });
		await random.job({ id: job_id, field_id, client_id, freelancer_id });
		await random.freelancer_review(data);
	});

	describe('has a create method', () => {
		it('test', async() => {

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
});
