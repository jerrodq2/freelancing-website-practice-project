'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);


describe('Admins Model', () => {

	describe('Has a findOne method', () => {
		it('should retrieve a specific admin record', async() => {
			await Admins.create({
				id: 'ae5c05fd-f90b-4c00-b46d-c46bf397186a',
				first_name: `${process.env.ADMIN_FIRST_NAME}`,
				last_name: `${process.env.ADMIN_LAST_NAME}`,
				username: `${process.env.ADMIN_USERNAME}`,
				email: `${process.env.ADMIN_EMAIL}`,
				password: `${process.env.ADMIN_PASSWORD}`
			});

			const admin = await Admins.findOne('ae5c05fd-f90b-4c00-b46d-c46bf397186a');

			console.log('admin', admin);
		});
	});
});
