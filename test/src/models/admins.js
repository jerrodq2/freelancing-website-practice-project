'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it } = lab;
const Admins = require(`${process.cwd()}/src/models/admins`);


describe('Admins Model', () => {

	describe('Has a findOne method', () => {
		it('should retrieve a specific admin record', async() => {
			const admin = await Admins.findOne('ae5c05fd-f90b-4c00-b46d-c46bf397186a');

			console.log('admin', admin);
		});
	});
});
