'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const { db, random, knex, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Admins Model', () => {
	const id = random.guid(),
		first_name = random.name(),
		last_name = random.name(),
		username = 'username',
		email = 'admin@email.com',
		password = random.word(),
		data = { id, first_name, last_name, username, email, password };


	before(async() => {
		await db.resetTable('admins');
		return random.admin(data);
	});


	// simple function used to create the necessary unique variables to create a new admin and add it to the above data object
	const createNewData = () => {
		const specificId = random.guid(),
			specificUsername = `username - ${specificId}`,
			specificEmail = `${specificId}@email.com`,

			obj = { id: specificId, username: specificUsername, email: specificEmail },
			createData = Object.assign({}, data, obj);

		return createData;
	};

	// checks all the basic fields that are returned in a create or findOne method for example
	const checkFields = (obj, givenId, givenEmail) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.first_name).to.equal(first_name);
		expect(obj.last_name).to.equal(last_name);
		expect(obj.email).to.equal(givenEmail);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
		expect(obj.username).to.equal(undefined);
		expect(obj.password).to.equal(undefined);
	};


	describe('has a create method', () => {
		const createData = createNewData(),
			specificId = createData.id,
			specificEmail = createData.email,
			specificUsername = createData.username;
		let result, admin, record;

		before(async() => {
			result = await Admins.create(createData);
			record = await knex('admins').where({ id: specificId });
			admin = record[0];
		});

		it.only('should create a new admin record if given valid data, create new created_at and updated_at fields, and return the admin object without the username or password', async () => {
			checkFields(result, specificId, specificEmail);
		});

		it('should create the new record with the given username and the hashed password', async () => {
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(specificId);
			expect(admin.username).to.equal(specificUsername);
			expect(admin.password).to.be.a.string();
			expect(admin.password).to.not.equal(password);
			expect(admin.password.length).to.be.above(password.length);
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(Admins, 'admin', 'create', createData);
		});

		// check that certain fields are required to create
		it('should require a first_name to create', async() => {
			return checkErr.checkNotNull(Admins, 'admin', createNewData(), 'first_name');
		});
		it('should require a last_name to create', async() => {
			return checkErr.checkNotNull(Admins, 'admin', createNewData(), 'last_name');
		});
		it('should require a username to create', async() => {
			return checkErr.checkNotNull(Admins, 'admin', createNewData(), 'username');
		});
		it('should require a email to create', async() => {
			return checkErr.checkNotNull(Admins, 'admin', createNewData(), 'email');
		});
		it('should require a password to create', async() => {
			return checkErr.checkNotNull(Admins, 'admin', createNewData(), 'password');
		});

		// check that certain fields have to be unique to create
		it('should raise an exception if the username isn\'t unique (unique field)', async() => {
			return checkErr.checkUnique(Admins, 'admin', 'create', createNewData(), 'username', username);
		});
		it('should raise an exception if the email isn\'t unique (unique field)', async() => {
			return checkErr.checkUnique(Admins, 'admin', 'create', createNewData(), 'email', email);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific admin with a given id, and return an object without the password or username', async() => {
			const admin = await Admins.findOne(id);
			return checkFields(admin, id, email);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Admins, 'admin', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Admins, 'admin', 'find', {});
		});
	});


	describe('has an update method', () => {
		const newFirstName = random.name(),
			newLastName = random.name(),
			specificId = random.guid(); //used in the checkUnique error tests below

		before(() => random.admin({ id: specificId }));

		it('should update the admin record if given a valid id and data, and return the updated object without password or username', async() => {
			const createData = createNewData(),
				specificId = createData.id,
				specificEmail = createData.email,
				newEmail = `update-${specificEmail}`;

			await random.admin(Object.assign({}, data, createData));

			const updateData = { first_name: newFirstName, last_name: newLastName, email: newEmail };
			const admin = await Admins.findOne(specificId);

			// checks the fields for the above admin record
			checkFields(admin, specificId, specificEmail);


			const updatedAdmin = await Admins.update(specificId, updateData);

			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(newLastName);
			expect(updatedAdmin.email).to.equal(newEmail);
			expect(updatedAdmin.updated_at).to.be.a.date();
			expect(updatedAdmin.username).to.equal(undefined);
			expect(updatedAdmin.password).to.equal(undefined);
		});

		it('should update the admin record with the given id if given valid data, even if only given one field', async() => {
			const createData = createNewData(),
				specificId = createData.id,
				specificEmail = createData.email;

			await random.admin(Object.assign({}, data, createData));

			const updateData = { first_name: newFirstName };
			const admin = await Admins.findOne(specificId);

			// checks the fields for the above admin record
			checkFields(admin, specificId, specificEmail);

			await Admins.update(specificId, updateData);

			const updatedAdmin = await Admins.findOne(specificId);
			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(last_name);
			expect(updatedAdmin.email).to.equal(specificEmail);
			expect(updatedAdmin.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Admins, 'admin', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Admins, 'admin', 'update', {});
		});

		it('should raise an exception if the username isn\'t unique (unique field)', async() => {
			return checkErr.checkUnique(Admins, 'admin', 'update', createNewData(), 'username', username, specificId);
		});
		it('should raise an exception if the email isn\'t unique (unique field)', async() => {
			return checkErr.checkUnique(Admins, 'admin', 'update', createNewData(), 'email', email, specificId);
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const specificId = random.guid();
			await random.admin({ id: specificId });

			const admin = await Admins.findOne(specificId);
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(specificId);

			const afterDelete = await Admins.delete(specificId);
			expect(afterDelete).to.equal(true);
			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Admins, 'admin', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Admins, 'admin', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Admins, 'admin', 'delete', {});
		});
	});

});
