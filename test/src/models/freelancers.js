'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, knex, checkErr, _ } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Freelancers Model', () => {
	const id = random.guid(),
		first_name = random.name(),
		last_name = random.name(),
		username = 'username',
		email = 'freelancer@email.com',
		job_title = random.word(),
		rate = 15,
		experience_level = 'entry',
		video_url = null,
		portfolio_url = null,
		available = true,
		gender = 'female',
		age = 49,
		field_id = random.guid(),
		field = random.word(),
		summary = random.paragraph(),
		state = 'NY',
		city = random.word(),
		zip = random.zip(),
		phone = random.phone(),
		dob = random.date({ string: true }),
		password = random.word(),
		data = { id, first_name, last_name, username, email, job_title, rate, experience_level, video_url, portfolio_url, available, gender, age, field_id, summary, state, city, zip, phone, dob, password };


	before(async() => {
		await db.resetTable('fields');
		await db.resetTable('freelancers');
		await random.field({ id: field_id, field });
		return random.freelancer(data);
	});


	// simple function used to and an object with the necessary unique variables to create a new freelancer
	const createNewData = () => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			obj = { id: specificId, username: specificUsername, email: specificEmail },

			createData = Object.assign({}, data, obj);
		return createData;
	};

	//// checks all fields returned from the create or createWithoutHash method
	const checkFields = (obj, givenId, givenEmail) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.first_name).to.equal(first_name);
		expect(obj.last_name).to.equal(last_name);
		expect(obj.email).to.equal(givenEmail);
		expect(obj.job_title).to.equal(job_title);
		expect(obj.rate).to.equal(rate);
		expect(obj.experience_level).to.equal(experience_level);
		expect(obj.video_url).to.equal(video_url);
		expect(obj.portfolio_url).to.equal(portfolio_url);
		expect(obj.available).to.equal(available);
		expect(obj.gender).to.equal(gender);
		expect(obj.age).to.equal(age);
		expect(obj.field_id).to.equal(field_id);
		expect(obj.summary).to.equal(summary);
		expect(obj.state).to.equal(state);
		expect(obj.city).to.equal(city);
		expect(obj.zip).to.equal(zip);
		expect(obj.phone).to.equal(phone);
		expect(obj.dob).to.equal(new Date(dob));
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
		expect(obj.username).to.equal(undefined);
		expect(obj.password).to.equal(undefined);
	};


	describe('has a create method', () => {
		const createData = createNewData(),
			specificId = createData.id,
			specificUsername = createData.username,
			specificEmail = createData.email;
		let record, freelancer, result;

		before(async() => {
			result = await Freelancers.create(createData);
			record = await knex('freelancers').where({ id: specificId });
			freelancer = record[0];
		});

		it('should create a new freelancer record if given valid data, create new created_at and updated_at fields, and return the freelancer object without the username or password', async() => {
			return checkFields(result, specificId, specificEmail);
		});

		it('should create the new record with the given username and the hashed password', async() => {
			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(specificId);
			expect(freelancer.username).to.equal(specificUsername);
			expect(freelancer.password).to.be.a.string();
			expect(freelancer.password).to.not.equal(password);
			expect(freelancer.password.length).to.be.above(password.length);
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = createNewData();
			createData.id = 1;
			return checkErr.checkIdFormat(Freelancers, 'freelancer', 'create', createData);
		});

		// check that certain fields are required to create
		it('should require a first_name to create', async() => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'first_name');
		});
		it('should require a last_name to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'last_name');
		});
		it('should require a username to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'username');
		});
		it('should require a email to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'email');
		});
		it('should require a job_title to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'job_title');
		});
		it('should require a rate to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'rate');
		});
		it('should require a gender to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'gender');
		});
		it('should require a age to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'age');
		});
		it('should require a field_id to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'field_id');
		});
		it('should require a experience_level to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'experience_level');
		});
		it('should require a password to create', () => {
			return checkErr.checkNotNull(Freelancers, 'freelancer', createNewData(), 'password');
		});

		// check that certain fields have to be unique to create
		it('should raise an exception if the username isn\'t unique (unique field)', () => {
			return checkErr.checkUnique(Freelancers, 'freelancer', createNewData(), 'username', username);
		});
		it('should raise an exception if the email isn\'t unique (unique field)', () => {
			return checkErr.checkUnique(Freelancers, 'freelancer', createNewData(), 'email', email);
		});

		// check that the field_id must belong to an actual field in the db
		it('should raise an exception if given an incorrect field_id (foreign key not found)', () => {
			return checkErr.checkForeign(Freelancers, 'freelancer', createNewData(), 'field_id', random.guid());
		});

		it('should have an \'available\' field that defaults to true if not given upon create', async() => {
			const data = createNewData(),
				specificId = data.id,
				createData = _.omit(data, 'available'),
				freelancer = await Freelancers.create(createData);

			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(specificId);
			expect(freelancer.available).to.equal(true);
		});
	});


	describe('has a createWithoutHash method used for testing that doesn\'t hash the given password,', () => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,
			createData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });
		let record, freelancer, result;

		before(async() => {
			result = await Freelancers.createWithoutHash(createData);
			record = await knex('freelancers').where({ id: specificId });
			freelancer = record[0];
		});

		it('should create a new freelancer record if given valid data, create new created_at and updated_at fields, and return the client object without the username or password', async() => {
			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);
			expect(result.first_name).to.equal(first_name);
			expect(result.last_name).to.equal(last_name);
			expect(result.email).to.equal(specificEmail);
			expect(result.job_title).to.equal(job_title);
			expect(result.rate).to.equal(rate);
			expect(result.experience_level).to.equal(experience_level);
			expect(result.video_url).to.equal(video_url);
			expect(result.portfolio_url).to.equal(portfolio_url);
			expect(result.available).to.equal(available);
			expect(result.gender).to.equal(gender);
			expect(result.age).to.equal(age);
			expect(result.field_id).to.equal(field_id);
			expect(result.summary).to.equal(summary);
			expect(result.state).to.equal(state);
			expect(result.city).to.equal(city);
			expect(result.zip).to.equal(zip);
			expect(result.phone).to.equal(phone);
			expect(result.dob).to.equal(new Date(dob));
			expect(result.created_at).to.be.a.date();
			expect(result.updated_at).to.equal(null);
			expect(result.username).to.equal(undefined);
			expect(result.password).to.equal(undefined);
		});

		it('should create the new record with the given username and the plain password', async() => {
			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(specificId);
			expect(freelancer.username).to.equal(specificUsername);
			expect(freelancer.password).to.equal(password);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific freelancer with a given id, and return an object without the password, username, or field_id, but with the name of the field', async() => {
			const freelancer = await Freelancers.findOne(id);

			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(id);
			expect(freelancer.first_name).to.equal(first_name);
			expect(freelancer.last_name).to.equal(last_name);
			expect(freelancer.email).to.equal(email);
			expect(freelancer.job_title).to.equal(job_title);
			expect(freelancer.rate).to.equal(rate);
			expect(freelancer.experience_level).to.equal(experience_level);
			expect(freelancer.video_url).to.equal(video_url);
			expect(freelancer.portfolio_url).to.equal(portfolio_url);
			expect(freelancer.available).to.equal(available);
			expect(freelancer.gender).to.equal(gender);
			expect(freelancer.age).to.equal(age);
			expect(freelancer.field).to.equal(field);
			expect(freelancer.summary).to.equal(summary);
			expect(freelancer.state).to.equal(state);
			expect(freelancer.city).to.equal(city);
			expect(freelancer.zip).to.equal(zip);
			expect(freelancer.phone).to.equal(phone);
			expect(freelancer.dob).to.equal(new Date(dob));
			expect(freelancer.username).to.equal(undefined);
			expect(freelancer.password).to.equal(undefined);
			expect(freelancer.field_id).to.equal(undefined);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Freelancers, 'freelancer', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Freelancers, 'freelancer', 'find', {});
		});
	});


	describe('has an update method', () => {
		const newFieldId = random.guid(),
			newFirstName = random.name(),
			newLastName = random.name(),
			newJobTitle = random.word(),
			newRate = 75,
			newExperienceLevel = 'expert',
			newAvailability = false,
			newGender = 'male',
			newAge = 22,
			newSummary = random.paragraph(),
			newState = 'FL',
			newCity = random.word(),
			newZip = random.zip(),
			newPhone = random.phone(),
			newDob = random.date({ string: true });

		let updateData = { field_id: newFieldId, first_name: newFirstName, last_name: newLastName, job_title: newJobTitle, rate: newRate, experience_level: newExperienceLevel, available: newAvailability, gender: newGender, age: newAge, summary: newSummary, state: newState, city: newCity, zip: newZip, phone: newPhone, dob: newDob };

		before(() => random.field({ id: newFieldId }));

		it('should update the freelancer record if given a valid id and data, and return the updated object without password or username', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				newEmail = `update-${specificEmail}`,
				createData = { id: specificId, email: specificEmail, field_id };

			updateData = Object.assign(updateData, { email: newEmail });

			await random.freelancer(createData);
			const oldFreelancer = await Freelancers.findOne(specificId);

			expect(oldFreelancer).to.be.an.object();
			expect(oldFreelancer.id).to.equal(specificId);
			expect(oldFreelancer.email).to.equal(specificEmail);
			expect(oldFreelancer.updated_at).to.equal(null);

			const updatedFreelancer = await Freelancers.update(specificId, updateData);

			expect(updatedFreelancer).to.be.an.object();
			expect(updatedFreelancer.id).to.equal(specificId);
			expect(updatedFreelancer.first_name).to.equal(newFirstName);
			expect(updatedFreelancer.last_name).to.equal(newLastName);
			expect(updatedFreelancer.email).to.equal(newEmail);
			expect(updatedFreelancer.job_title).to.equal(newJobTitle);
			expect(updatedFreelancer.rate).to.equal(newRate);
			expect(updatedFreelancer.experience_level).to.equal(newExperienceLevel);
			expect(updatedFreelancer.available).to.equal(newAvailability);
			expect(updatedFreelancer.gender).to.equal(newGender);
			expect(updatedFreelancer.age).to.equal(newAge);
			expect(updatedFreelancer.field_id).to.equal(newFieldId);
			expect(updatedFreelancer.summary).to.equal(newSummary);
			expect(updatedFreelancer.state).to.equal(newState);
			expect(updatedFreelancer.city).to.equal(newCity);
			expect(updatedFreelancer.zip).to.equal(newZip);
			expect(updatedFreelancer.phone).to.equal(newPhone);
			expect(updatedFreelancer.dob).to.equal(new Date(newDob));
			expect(updatedFreelancer.updated_at).to.be.a.date();
			expect(updatedFreelancer.username).to.equal(undefined);
			expect(updatedFreelancer.password).to.equal(undefined);
		});

		it('should update the freelancer record with the given id if given valid data, even if only given one field', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				originalFirstName = random.name(),
				createData = { id: specificId, email: specificEmail, field_id, first_name: originalFirstName },
				updateData = { first_name: newFirstName };

			await random.freelancer(createData);
			const oldFreelancer = await Freelancers.findOne(specificId);

			expect(oldFreelancer).to.be.an.object();
			expect(oldFreelancer.id).to.equal(specificId);
			expect(oldFreelancer.email).to.equal(specificEmail);
			expect(oldFreelancer.first_name).to.equal(originalFirstName);
			expect(oldFreelancer.updated_at).to.equal(null);

			const updatedFreelancer = await Freelancers.update(specificId, updateData);

			expect(updatedFreelancer).to.be.an.object();
			expect(updatedFreelancer.id).to.equal(specificId);
			expect(updatedFreelancer.first_name).to.equal(newFirstName);
			expect(updatedFreelancer.updated_at).to.be.a.date();
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const specificId = random.guid();
			await random.freelancer({ id: specificId, field_id });

			const freelancer = await Freelancers.findOne(specificId);
			expect(freelancer).to.be.an.object();
			expect(freelancer.id).to.equal(specificId);

			const afterDelete = await Freelancers.delete(specificId);
			expect(afterDelete).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Freelancers, 'freelancer', 'find', specificId);
		});
	});
});
