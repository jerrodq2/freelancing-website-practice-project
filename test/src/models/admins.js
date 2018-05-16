'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);

describe('Admins Model', () => {
	const id = random.guid(), first_name = 'first', last_name = 'last', username = 'username', email = 'email@email.com', password = 'password';


	before(async() => {
		await db.resetTable('admins');
		return Admins.create({
			id,
			first_name,
			last_name,
			username,
			password,
			email,
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

	describe('has a create method', () => {
		const secondId = random.guid(), secondUsername = 'username2', secondEmail = 'email2@email.com';
		const data = {
			id: secondId,
			first_name,
			last_name,
			username: secondUsername,
			email: secondEmail,
			password,
		};

		before(() => {
			return Admins.create(data);
		});

		it('should create a new admin record if given all the necessary info, with a created_at and updated_at field', async () => {
			const result = await knex('admins').where({ id: secondId });
			const admin = result[0];

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(secondId);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(secondEmail);
			expect(admin.username).to.equal(secondUsername);
			expect(admin.created_at).to.be.a.date();
			expect(admin.updated_at).to.equal(null);
		});

		it('should create a new admin record with a hashed password', async () => {
			const result = await knex('admins').where({ id: secondId });
			const admin = result[0];

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(secondId);
			expect(admin.password).to.be.a.string();
			expect(admin.password).to.not.equal(password);
			expect(admin.password.length).to.be.above(password.length);
		});
	});

});
