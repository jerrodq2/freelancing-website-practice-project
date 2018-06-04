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
		start_date = random.date({ string: true }),
		end_date = random.date({ string: true }),
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


	// simple function used to create a new id in order to create a new employment_history record
	const createNewData = () => {
		const specificId = random.guid(),
			createData = Object.assign({}, data, { id: specificId });
		return createData;
	};

	// function that checks all of the fields of a given object match the fields created at the top
	const checkFields = (obj, givenId) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.title).to.equal(title);
		expect(obj.company).to.equal(company);
		expect(obj.start_date).to.equal(new Date(start_date));
		expect(obj.end_date).to.equal(new Date(end_date));
		expect(obj.present_job).to.equal(present_job);
		expect(obj.summary).to.equal(summary);
		expect(obj.freelancer_id).to.equal(freelancer_id);
	};


	describe('has a create method', () => {
		const createData = createNewData(),
			specificId = createData.id;
		let history;

		before(async() => history = await EmploymentHistory.create(createData));

		it('should create a new employment_history record if given valid data, create new created_at and updated_at fields, and return the employment_history object', async() => {
			return checkFields(history, specificId);
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
