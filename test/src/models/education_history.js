'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const EducationHistory = require(`${process.cwd()}/src/models/education_history`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Education History Model', () => {
	const id = random.guid(),
		degree = random.word(),
		school = random.word(),
		area_of_study = random.word(),
		start_date = random.date({ string: true }),
		end_date = random.date({ string: true }),
		description = random.paragraph(),
		freelancer_id = random.guid(),
		field_id = random.guid(),
		data = { id, degree, school, area_of_study, start_date, end_date, description, freelancer_id };

	before(async() => {
		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.education_history(data);
	});

	describe('has a create method', () => {
		it('text', async() => {
			
		});
	});


	describe('has a findHistory method', () => {

	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});
});
