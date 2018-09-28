'use strict';


// This file tests the education_history src model. It tests what should work, how it should work, and what should cause errors
const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const EducationHistory = require(`${process.cwd()}/src/services/freelancer_history/models/education_history`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Education History Model', () => {
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
		it('should require a area_of_study to create', async() => {
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
		it('should default the \'currently_attending\' field to false if not given', async() => {
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
		const secondFreelancerId = random.guid(),
			specificSchool = random.word();

		before(async() => {
			await random.freelancer({ id: secondFreelancerId, field_id });
			await random.education_histories(5, { freelancer_id: secondFreelancerId, school: specificSchool });
		});

		it('should retrieve all of the education_history records for a specific freelancer and return an array of objects', async() => {
			const arr = await EducationHistory.findHistory(secondFreelancerId);

			expect(arr).to.be.an.array();
			expect(arr.length).to.equal(5);
			const history = arr[0];
			expect(history).to.be.an.object();
			expect(history.freelancer_id).to.equal(secondFreelancerId);
			expect(history.school).to.equal(specificSchool);
		});

		it('should return an empty array if that freelancer has no education_history records', async() => {
			const specificId = random.guid();
			await random.freelancer({ id: specificId, field_id });

			const arr = await EducationHistory.findHistory(specificId);
			expect(arr).to.be.an.array();
			expect(arr.length).to.equal(0);
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EducationHistory, 'education_history', 'find history for', {});
		});

	});


	describe('has a findOne method', () => {
		it('should retrieve a specific education_history record with a given id and return the object', async() => {
			const history = await EducationHistory.findOne(id);
			// check the usual fields
			checkFields(history, id);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(EducationHistory, 'education_history', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EducationHistory, 'education_history', 'find', {});
		});
	});


	describe('has an update method', () => {
		const new_degree = random.word(),
			new_school = random.word(),
			new_area_of_study = random.word(),
			new_start_date = random.date({ string: true }),
			new_end_date = random.date({ string: true }),
			new_currently_attending = false,
			new_description = random.paragraph();
		let updateData = {
			degree: new_degree,
			school: new_school,
			area_of_study: new_area_of_study,
			start_date: new_start_date,
			end_date: new_end_date,
			currently_attending: new_currently_attending,
			description: new_description
		};

		it('should update the education_history record if given a valid id and data, and return the updated object', async() => {
			const createData = createNewData(),
				specificId = createData.id;

			const oldHistory = await EducationHistory.create(createData);
			expect(oldHistory).to.be.an.object();
			expect(oldHistory.id).to.equal(specificId);
			expect(oldHistory.updated_at).to.equal(null);

			const updatedHistory = await EducationHistory.update(specificId, updateData);

			expect(updatedHistory).to.be.an.object();
			expect(updatedHistory.id).to.equal(specificId);
			expect(updatedHistory.degree).to.equal(new_degree);
			expect(updatedHistory.school).to.equal(new_school);
			expect(updatedHistory.area_of_study).to.equal(new_area_of_study);
			expect(updatedHistory.start_date).to.equal(new Date(new_start_date));
			expect(updatedHistory.end_date).to.equal(new Date(new_end_date));
			expect(updatedHistory.currently_attending).to.equal(new_currently_attending);
			expect(updatedHistory.description).to.equal(new_description);
			expect(updatedHistory.updated_at).to.be.a.date();
		});

		it('should update the education_history record with the given id if given valid data, even if only given one field', async() => {
			const createData = createNewData(),
				specificId = createData.id;
			updateData = { degree: new_degree };

			const oldHistory = await EducationHistory.create(createData);
			expect(oldHistory).to.be.an.object();
			expect(oldHistory.id).to.equal(specificId);
			expect(oldHistory.degree).to.equal(degree);
			expect(oldHistory.updated_at).to.equal(null);

			const updatedHistory = await EducationHistory.update(specificId, updateData);

			expect(updatedHistory).to.be.an.object();
			expect(updatedHistory.id).to.equal(specificId);
			expect(updatedHistory.degree).to.equal(new_degree);
			expect(updatedHistory.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(EducationHistory, 'education_history', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EducationHistory, 'education_history', 'update', {});
		});

		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', () => {
			return checkErr.checkForeign(EducationHistory, 'education_history', 'update', updateData, 'freelancer_id', random.guid(), id);
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id', async() => {
			const specificId = random.guid();
			await random.education_history({ id: specificId, freelancer_id });

			const history = await EducationHistory.findOne(specificId);
			expect(history).to.be.an.object();
			expect(history.id).to.equal(specificId);

			const afterDelete = await EducationHistory.delete(specificId);
			expect(afterDelete).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(EducationHistory, 'education_history', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(EducationHistory, 'education_history', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EducationHistory, 'education_history', 'delete', {});
		});
	});


	describe('has a freelancer_id with \'cascade\' onDelete', () => {
		it('should be deleted in the event of the freelancer it belongs to is deleted', async() => {
			const createData = createNewData(),
				specificId = createData.id,
				specificFreelancer = random.guid();
			createData.freelancer_id = specificFreelancer;

			await random.freelancer({ id: specificFreelancer, field_id });
			const history = await EducationHistory.create(createData);

			expect(history).to.be.an.object();
			expect(history.id).to.equal(specificId);
			expect(history.freelancer_id).to.equal(specificFreelancer);

			const result = await Freelancers.delete(specificFreelancer);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(EducationHistory, 'education_history', 'find', specificId);
		});
	});
});
