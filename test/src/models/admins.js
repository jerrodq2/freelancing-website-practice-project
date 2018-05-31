'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const { db, random, knex, _ } = require(`${process.cwd()}/test/src/helpers`);


describe('Admins Model', () => {
	const id = random.guid(),
		first_name = 'first',
		last_name = 'last',
		username = 'username',
		email = 'email@email.com',
		password = 'password';
	const data = { id, first_name, last_name, username, email, password };


	before(async() => {
		await db.resetTable('admins');
		return random.admin(data);
	});


	describe('has a create method', () => {
		// checks that certain fields are required upon create
		const checkRequired = async(field) => {
			const newData = { id: random.guid(), first_name: random.name(), last_name: random.name(), username: random.word(), email: `${random.word()}@email.com`, password },
				createData = _.omit(newData, field);

			try {
				await Admins.create(createData);
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include(field);
				expect(err.message).to.include('violated the not-null constraint');
			}
		};

		const checkUnique = async(field, value) => {
			const createData = { id: random.guid(), first_name: random.name(), last_name: random.name(), username: random.word(), email: `${random.word()}@email.com`, password };
			createData[`${field}`] = value;

			try {
				await Admins.create(createData);
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include(`'${field}'`);
				expect(err.message).to.include('violated the unique constraint');
			}
		};


		const specificId = random.guid(),
			specificUsername = 'create',
			specificEmail = 'create@email.com';
		let result, admin, record;

		const newData = Object.assign({}, data, { id: specificId, username: specificUsername, email: specificEmail });

		before(async() => {
			result = await Admins.create(newData);
			record = await knex('admins').where({ id: specificId });
			admin = record[0];
		});

		it('should create a new admin record if given valid data, create new created_at and updated_at fields, and return the admin object without the username or password', async () => {
			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);
			expect(result.first_name).to.equal(first_name);
			expect(result.last_name).to.equal(last_name);
			expect(result.email).to.equal(specificEmail);
			expect(result.created_at).to.be.a.date();
			expect(result.updated_at).to.equal(null);
			expect(result.username).to.equal(undefined);
			expect(result.password).to.equal(undefined);
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
			const specificId = 1,
				createData = Object.assign({}, data, { id: specificId, username: 'fail', email: 'fail@email.com' });

			try {
				await Admins.create(createData);
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});


		it('should require a first_name to create', async() => {
			return checkRequired('first_name');
		});
		it('should require a last_name to create', async() => {
			return checkRequired('last_name');
		});
		it('should require a username to create', async() => {
			return checkRequired('username');
		});
		it('should require a email to create', async() => {
			return checkRequired('email');
		});
		it('should require a password to create', async() => {
			return checkRequired('password');
		});


		it('should raise an exception if the username isn\'t unique (unique field)', async() => {
			return checkUnique('username', username);
		});
		it('should raise an exception if the username isn\'t unique (unique field)', async() => {
			return checkUnique('email', email);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific admin with a given id, and return an object without the password or username', async() => {
			const admin = await Admins.findOne(id);
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.username).to.equal(undefined);
			expect(admin.email).to.equal(email);
			expect(admin.password).to.equal(undefined);
		});

		it('should raise an exception if not found', async() => {
			try {
				await Admins.findOne(random.guid());
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('find');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			try {
				await Admins.findOne(1);
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('find');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});
	});


	describe('has an update method', () => {
		const newFirstName = 'new first',
			newLastName = 'new last';

		it('should update the admin record if given a valid id and data, and return the updated object without password or username', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				specificUsername = `username - ${specificId}`,
				newEmail = `update-${specificEmail}`,
				createData = { id: specificId, email: specificEmail, username: specificUsername };
			await random.admin(Object.assign({}, data, createData));

			const updateData = { first_name: newFirstName, last_name: newLastName, email: newEmail };
			const admin = await Admins.findOne(specificId);

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(specificId);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(specificEmail);
			expect(admin.updated_at).to.equal(null);

			const updatedAdmin = await Admins.update(specificId, updateData);

			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(newLastName);
			expect(updatedAdmin.email).to.equal(newEmail);
			expect(updatedAdmin.updated_at).to.be.a.date();
			expect(updatedAdmin.username).to.equal(undefined);
			expect(updatedAdmin.password).to.equal(undefined);
		});

		it('should update the admin record with the given id if given valid data, even if only given one field', async() => {
			const specificId = random.guid(),
				specificEmail = `${specificId}@email.com`,
				specificUsername = `username - ${specificId}`,
				createData = { id: specificId, email: specificEmail, username: specificUsername };
			await random.admin(Object.assign({}, data, createData));

			const updateData = { first_name: newFirstName };
			const admin = await Admins.findOne(specificId);

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(specificId);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(specificEmail);
			expect(admin.updated_at).to.equal(null);

			await Admins.update(specificId, updateData);

			const updatedAdmin = await Admins.findOne(specificId);
			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(last_name);
			expect(updatedAdmin.email).to.equal(specificEmail);
			expect(updatedAdmin.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			try {
				await Admins.update(random.guid(), {});
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('update');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			try {
				await Admins.update(1, {});
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('update');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('wasn\'t in proper uuid format');
			}
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
			try {
				await Admins.findOne(specificId);
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('find');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			try {
				await Admins.delete(random.guid());
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('delete');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			try {
				await Admins.delete(1);
			} catch (err) {
				expect(err.message).to.include('admin');
				expect(err.message).to.include('delete');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('wasn\'t in proper uuid format');
			}
		});
	});

});
