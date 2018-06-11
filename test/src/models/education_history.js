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
		currently_attending = true,
		description = random.paragraph(),
		freelancer_id = random.guid(),
		field_id = random.guid(),
		data = { id, degree, school, area_of_study, start_date, end_date, currently_attending, description, freelancer_id };

	before(async() => {
		await db.resetTable('education_history');
		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.education_history(data);
	});


	// simple function used to create a new id in order to create a new education_history record
	const createNewData = () => {
		const specificId = random.guid(),
			createData = Object.assign({}, data, { id: specificId });
		return createData;
	};

	// function that checks all of the fields of a given object match the fields created at the top
	const checkFields = (obj, givenId) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.degree).to.equal(degree);
		expect(obj.school).to.equal(school);
		expect(obj.area_of_study).to.equal(area_of_study);
		expect(obj.start_date).to.equal(new Date(start_date));
		expect(obj.end_date).to.equal(new Date(end_date));
		expect(obj.currently_attending).to.equal(currently_attending);
		expect(obj.description).to.equal(description);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		const createData = createNewData(),
			specificId = createData.id;
		let history;

		before(async() => history = await EducationHistory.create(createData));

		it('should create a new education_history record if given valid data, create new created_at and updated_at fields, and return the education_history object', async() => {
			return checkFields(history, specificId);
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(EducationHistory, 'education_history', 'create', createData);
		});

		// check that certain fields are required to create
		it('should require a degree to create', async() => {
			return checkErr.checkNotNull(EducationHistory, 'education_history', createNewData(), 'degree');
		});
		it('should require a school to create', async() => {
			return checkErr.checkNotNull(EducationHistory, 'education_history', createNewData(), 'school');
		});
		it('should require a school to area_of_study', async() => {
			return checkErr.checkNotNull(EducationHistory, 'education_history', createNewData(), 'area_of_study');
		});
		it('should require a start_date to create', async() => {
			return checkErr.checkNotNull(EducationHistory, 'education_history', createNewData(), 'start_date');
		});
		it('should require a freelancer_id to create', async() => {
			return checkErr.checkNotNull(EducationHistory, 'education_history', createNewData(), 'freelancer_id');
		});

		// check that the freelancer_id must belong to an actual field in the db
		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', () => {
			return checkErr.checkForeign(EducationHistory, 'education_history', 'create', createNewData(), 'freelancer_id', random.guid());
		});

		// checks default values
		it('should default the \'present_job\' field to false if not given', async() => {
			const data = createNewData(),
				specificId = data.id,
				createData = _.omit(data, 'currently_attending');

			const history = await EducationHistory.create(createData);

			expect(history).to.be.an.object();
			expect(history.id).to.equal(specificId);
			expect(history.currently_attending).to.equal(false);
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
