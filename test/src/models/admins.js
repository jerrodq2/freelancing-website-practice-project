'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);
const knex = require(`${process.cwd()}/src/config/knex`);
const { db } = require(`${process.cwd()}/test/src/helpers`);

describe('Admins Model', () => {


	before(() => {
		return db.resetTable('admins');
	});

	describe('Has a findOne method', () => {
		it('should retrieve a specific admin record', async() => {


			// await Admins.create({
			// 	id: 'ae5c05fd-f90b-4c00-b46d-c46bf397186a',
			// 	first_name: `${process.env.ADMIN_FIRST_NAME}`,
			// 	last_name: `${process.env.ADMIN_LAST_NAME}`,
			// 	username: `test`,
			// 	email: `test@test.com`,
			// 	password: `${process.env.ADMIN_PASSWORD}`
			// });

			const admin = await Admins.findOne('ae5c05fd-f90b-4c00-b46d-c46bf397186a');

			console.log('admin', admin);
		});
	});
});
