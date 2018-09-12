'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const EmploymentHistory = require(`${process.cwd()}/src/services/freelancer_history/models/employment_history`);
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const { db, random, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Employment History Model', () => {
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
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
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
			return checkErr.checkForeign(EmploymentHistory, 'employment_history', 'create', createNewData(), 'freelancer_id', random.guid());
		});

		// checks default values
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


	describe('has a findHistory method', () => {
		const secondFreelancerId = random.guid(),
			specificTitle = random.word();

		before(async() => {
			await random.freelancer({ id: secondFreelancerId, field_id });
			await random.employment_histories(5, { freelancer_id: secondFreelancerId, title: specificTitle });
		});

		it('should retrieve all of the employment_history records for a specific freelancer and return an array objects', async() => {
			const arr = await EmploymentHistory.findHistory(secondFreelancerId);

			expect(arr).to.be.an.array();
			expect(arr.length).to.equal(5);
			const history = arr[0];
			expect(history).to.be.an.object();
			expect(history.freelancer_id).to.equal(secondFreelancerId);
			expect(history.title).to.equal(specificTitle);
		});

		it('should return an empty array if that freelancer has no employment_history records', async() => {
			const specificId = random.guid();
			await random.freelancer({ id: specificId, field_id });

			const arr = await EmploymentHistory.findHistory(specificId);
			expect(arr).to.be.an.array();
			expect(arr.length).to.equal(0);
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EmploymentHistory, 'employment_history', 'find history for', {});
		});
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
		const new_title = random.word(),
			new_company = random.word(),
			new_start_date = random.date({ string: true }),
			new_end_date = random.date({ string: true }),
			new_present_job = true,
			new_summary = random.paragraph();
		let updateData = {
			title: new_title,
			company: new_company,
			start_date: new_start_date,
			end_date: new_end_date,
			present_job: new_present_job,
			summary: new_summary,
		};

		it('should update the employment_history record if given a valid id and data, and return the updated object', async() => {
			const createData = createNewData(),
				specificId = createData.id;

			const oldHistory = await random.employment_history(createData);
			expect(oldHistory).to.be.an.object();
			expect(oldHistory.id).to.equal(specificId);
			expect(oldHistory.updated_at).to.equal(null);

			const updatedHistory = await EmploymentHistory.update(specificId, updateData);

			expect(updatedHistory).to.be.an.object();
			expect(updatedHistory.id).to.equal(specificId);
			expect(updatedHistory.title).to.equal(new_title);
			expect(updatedHistory.company).to.equal(new_company);
			expect(updatedHistory.start_date).to.equal(new Date(new_start_date));
			expect(updatedHistory.end_date).to.equal(new Date(new_end_date));
			expect(updatedHistory.present_job).to.equal(new_present_job);
			expect(updatedHistory.summary).to.equal(new_summary);
			expect(updatedHistory.freelancer_id).to.equal(freelancer_id);
			expect(updatedHistory.updated_at).to.be.a.date();
		});

		it('should update the employment_history record with the given id if given valid data, even if only given one field', async() => {
			const createData = createNewData(),
				specificId = createData.id;
			updateData = { title: new_title };

			const oldHistory = await random.employment_history(createData);
			expect(oldHistory).to.be.an.object();
			expect(oldHistory.id).to.equal(specificId);
			expect(oldHistory.title).to.equal(title);
			expect(oldHistory.updated_at).to.equal(null);

			const updatedHistory = await EmploymentHistory.update(specificId, updateData);

			expect(updatedHistory).to.be.an.object();
			expect(updatedHistory.id).to.equal(specificId);
			expect(updatedHistory.title).to.equal(new_title);
			expect(updatedHistory.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(EmploymentHistory, 'employment_history', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EmploymentHistory, 'employment_history', 'update', {});
		});

		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', () => {
			return checkErr.checkForeign(EmploymentHistory, 'employment_history', 'update', updateData, 'freelancer_id', random.guid(), id);
		});


	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id', async() => {
			const specificId = random.guid();
			await random.employment_history({ id: specificId, freelancer_id });

			const history = await EmploymentHistory.findOne(specificId);
			expect(history).to.be.an.object();
			expect(history.id).to.equal(specificId);

			const afterDelete = await EmploymentHistory.delete(specificId);
			expect(afterDelete).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(EmploymentHistory, 'employment_history', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(EmploymentHistory, 'employment_history', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(EmploymentHistory, 'employment_history', 'delete', {});
		});
	});


	describe('has a freelancer_id with \'cascade\' onDelete', () => {
		it('should be deleted in the event of the freelancer it belongs to is deleted', async() => {
			const createData = createNewData(),
				specificId = createData.id,
				specificFreelancer = random.guid();
			createData.freelancer_id = specificFreelancer;

			await random.freelancer({ id: specificFreelancer, field_id });
			const history = await EmploymentHistory.create(createData);

			expect(history).to.be.an.object();
			expect(history.id).to.equal(specificId);
			expect(history.freelancer_id).to.equal(specificFreelancer);

			const result = await Freelancers.delete(specificFreelancer);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(EmploymentHistory, 'employment_history', 'find', specificId);
		});
	});
});
