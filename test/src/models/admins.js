'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);


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
		const newId = random.guid(),
			username = 'create',
			email = 'create@email.com';
		let result, admin;

		const newData = Object.assign({}, data, { id: newId, username, email });

		before(async() => {
			await Admins.create(newData);
			result = await knex('admins').where({ id: newId });
			admin = result[0];
		});

		it('should create a new admin record if given valid data', async () => {
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(newId);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(email);
			expect(admin.username).to.equal(username);
		});

		it('should create the new admin record with a hashed password, and new created_at and updated_at fields', async () => {
			expect(admin.created_at).to.be.a.date();
			expect(admin.updated_at).to.equal(null);
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(newId);
			expect(admin.password).to.be.a.string();
			expect(admin.password).to.not.equal(password);
			expect(admin.password.length).to.be.above(password.length);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific admin record without the password or username', async() => {
			const admin = await Admins.findOne(id);
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.username).to.equal(undefined);
			expect(admin.email).to.equal(email);
			expect(admin.password).to.equal(undefined);
		});

		it('should return an empty object if not found', async() => {
			const admin = await Admins.findOne(random.guid());

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(undefined);
			expect(admin.first_name).to.equal(undefined);
			expect(admin.email).to.equal(undefined);
		});
	});


	describe('has an update method', () => {
		const newFirstName = 'new first',
			newLastName = 'new last';

		it('should update the admin record if given a valid id and data', async() => {
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

			await Admins.update(specificId, updateData);

			const updatedAdmin = await Admins.findOne(specificId);
			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(newLastName);
			expect(updatedAdmin.email).to.equal(newEmail);
			expect(updatedAdmin.updated_at).to.be.a.date();
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
	});

	// TODO: write tests for incorrect id and what it returns upon successful delete once that process is refactored
	describe('has a delete method', () => {
		it('should delete the record if given a correct id', async() => {
			const specificId = random.guid();
			await random.admin({ id: specificId });

			const admin = await Admins.findOne(specificId);
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(specificId);

			await Admins.delete(specificId);
			const afterDelete = await Admins.findOne(specificId);

			expect(afterDelete).to.be.an.object();
			expect(afterDelete.id).to.equal(undefined);
		});
	});

});
