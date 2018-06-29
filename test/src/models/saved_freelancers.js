'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedFreelancers = require(`${process.cwd()}/src/models/saved_freelancers`);
const Clients = require(`${process.cwd()}/src/models/clients`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Saved Freelancers Model', () => {
	// data used to create the saved_freelancer
	const id = random.guid(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		data = { id, freelancer_id, client_id };

	// data used to create the freelancer and client, used in tests below
	const field_id = random.guid(),
		client_first_name = random.name(),
		client_last_name = random.name(),
		freelancer_first_name = random.name(),
		freelancer_last_name = random.name(),

		clientData = { id: client_id, field_id, first_name: client_first_name, last_name: client_last_name },

		freelancerData = { id: freelancer_id, field_id, first_name: freelancer_first_name, last_name: freelancer_last_name };

	before(async() => {
		// clearing these two tables will clear saved_freelancers via cascading delete
		await db.resetTable('clients');
		await db.resetTable('freelancers');

		await random.field({ id: field_id });
		await random.freelancer(freelancerData);
		await random.client(clientData);
		await random.saved_freelancer(data);
	});


	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id and client_id', () => {

	});
});
