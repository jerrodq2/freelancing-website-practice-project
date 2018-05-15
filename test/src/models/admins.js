'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const { db, random } = require(`${process.cwd()}/test/src/helpers`);

describe('Admins Model', () => {


	before(() => {
		return db.resetTable('admins');
	});

	describe('Has a findOne method', () => {
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
		});
	});
});
