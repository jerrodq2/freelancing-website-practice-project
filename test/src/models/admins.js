'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);

describe('Admins Model', () => {


	before(() => {
		return db.resetTable('admins');
	});

	describe('has a findOne method', () => {
		it('should retrieve a specific admin record without the password', async() => {
			const id = random.guid();
			await Admins.create({
				id,
				first_name: 'First',
				last_name: 'Last',
				username: 'User',
				password: 'password',
				email: 'e@mail.com'
			});

			const admin = await Admins.findOne(id);
			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
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
		const id = random.guid();
		const first_name = 'first';
		const last_name = 'last';
		const username = 'username';
		const email = 'email@email.com';
		const password = 'password';
		const data = {
			id,
			first_name,
			last_name,
			username,
			email,
			password,
		};

		before(() => {
			return Admins.create(data);
		});

		it('should create a new admin record if given all the necessary info, with a created_at and updated_at field', async () => {
			const result = await knex('admins').where({ id });
			const admin = result[0];

			expect(admin).to.be.an.object();
			expect(admin.id).to.equal(id);
			expect(admin.first_name).to.equal(first_name);
			expect(admin.last_name).to.equal(last_name);
			expect(admin.email).to.equal(email);
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

});
