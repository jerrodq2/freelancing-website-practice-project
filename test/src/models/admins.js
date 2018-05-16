'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before, beforeEach } = lab;
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

	beforeEach(async() => {
		await db.resetTable('admins');
		return Admins.create(data);
	});


	describe('has a create method', () => {
		it('should create a new admin record if given all the necessary info, with a created_at and updated_at field', async () => {
			const result = await knex('admins').where({ id });
			const admin = result[0];

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(email);
			expect(admin.username).to.equal(username);
			expect(admin.created_at).to.be.a.date();
			expect(admin.updated_at).to.equal(null);
		});

		it('should create a new admin record with a hashed password', async () => {
			const result = await knex('admins').where({ id });
			const admin = result[0];

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
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
			newLastName = 'new last',
			newEmail = 'new@email.com';

		it('should update the admin record with the given id if given valid data', async() => {
			const updateData = { first_name: newFirstName, last_name: newLastName, email: newEmail };
			const admin = await Admins.findOne(id);

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(email);

			await Admins.update(id, updateData);

			const updatedAdmin = await Admins.findOne(id);
			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(newLastName);
			expect(updatedAdmin.email).to.equal(newEmail);
		});

		it('should update the admin record with the given id and passed in the correct data', async() => {
			const updateData = { first_name: newFirstName, last_name: newLastName, email: newEmail };
			const admin = await Admins.findOne(id);

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);

			await Admins.update(id, updateData);

			const updatedAdmin = await Admins.findOne(id);
			expect(updatedAdmin.first_name).to.equal(newFirstName);
			expect(updatedAdmin.last_name).to.equal(newLastName);
			expect(updatedAdmin.email).to.equal(newEmail);
		});
	});

});
