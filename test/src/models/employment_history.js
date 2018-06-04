'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const EmploymentHistory = require(`${process.cwd()}/src/models/employment_history`);
const { db, random, knex, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Exmploymen History Model', () => {
	const id = random.guid(),
		title = random.word(),
		company = random.word(),
		start_date = random.date(),
		end_date = random.date(),
		present_job = true,
		summary = random.paragraph(),
		freelancer_id = random.guid(),
		field_id = random.guid(),
		data = { id, title, company, start_date, end_date, present_job, summary, freelancer_id };

	before(async() => {
		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.employment_history(data);
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
