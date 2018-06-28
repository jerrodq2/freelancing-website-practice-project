'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const SavedClients = require(`${process.cwd()}/src/models/saved_clients`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Saved Clients Model', () => {
	const id = random.guid(),
		freelancer_id = random.guid(),
		client_id = random.guid(),
		field_id = random.guid(),
		data = { id, freelancer_id, client_id };

	before(async() => {
		// clearing these two tables will clear saved_clients via cascading delete
		await db.resetTable('clients');
		await db.resetTable('freelancers');

		await random.field({ id: field_id });
		await random.freelancer({ id: freelancer_id, field_id });
		await random.client({ id: client_id, field_id });
		await random.saved_client(data);
	});
	describe('has a create method', () => {
		it('text', async() => {

		});
	});


	describe('has a findOne method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id and client_id', () => {

	});
});
