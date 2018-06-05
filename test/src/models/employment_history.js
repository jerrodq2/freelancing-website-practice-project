'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const EmploymentHistory = require(`${process.cwd()}/src/models/employment_history`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


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
		await db.resetTable('employment_history');
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

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(EmploymentHistory, 'employment_history', 'create', createData);
		});

		// check that certain fields are required to create
		it('should require a title to create', async() => {
			return checkErr.checkNotNull(EmploymentHistory, 'employment_history', createNewData(), 'title');
		});
		it('should require a company to create', async() => {
			return checkErr.checkNotNull(EmploymentHistory, 'employment_history', createNewData(), 'company');
		});
		it('should require a start_date to create', async() => {
			return checkErr.checkNotNull(EmploymentHistory, 'employment_history', createNewData(), 'start_date');
		});
		it('should require a freelancer_id to create', async() => {
			return checkErr.checkNotNull(EmploymentHistory, 'employment_history', createNewData(), 'freelancer_id');
		});

		// check that the freelancer_id must belong to an actual field in the db
		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', () => {
			return checkErr.checkForeign(EmploymentHistory, 'employment_history', createNewData(), 'freelancer_id', random.guid());
		});

		it('should default the \'present_job\' field to false if not given', async() => {
			const data = createNewData(),
				specificId = data.id,
				createData = _.omit(data, 'present_job');

			const history = await EmploymentHistory.create(createData);

			expect(history).to.be.an.object();
			expect(history.id).to.equal(specificId);
			expect(history.present_job).to.equal(false);

		});
	});


	describe('has a getAll method', () => {

	});


	describe('has a findOne method', () => {
		it('should retrieve a specific employment_history record with a given id, and return the object', async() => {
			const history = await EmploymentHistory.findOne(id);

			// check the usual fields first
			checkFields(history, id);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(EmploymentHistory, 'employment_history', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EmploymentHistory, 'employment_history', 'find', {});
		});
	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});
});
