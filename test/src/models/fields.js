'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Fields = require(`${process.cwd()}/src/models/fields`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);


describe('Fields Model', () => {
	const id = random.guid(),
		fieldName = random.word(),
		data = { id, field: fieldName };

	before(async() => {
		await db.resetAll();
		return random.field(data);
	});


	describe('has a create method', () => {
		const specificId = random.guid(),
			specificField = random.word(),
			createData = { id: specificId, field: specificField };

		before(() => Fields.create(createData));

		it('should create a new field record if given a proper id and field with a created_at and updated_at field', async() => {
			const result = await knex('fields').where({ id: specificId });
			const field = result[0];

			expect(field).to.be.an.object();
			expect(field.id).to.equal(specificId);
			expect(field.field).to.equal(specificField);
			expect(field.created_at).to.be.a.date();
			expect(field.updated_at).to.equal(null);
		});
	});


	describe('has a findOne method', () => {

	});
});
