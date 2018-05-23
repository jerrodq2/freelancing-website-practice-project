'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Fields = require(`${process.cwd()}/src/models/fields`);
const { db, random} = require(`${process.cwd()}/test/src/helpers`);


describe('Fields Model', () => {
	const id = random.guid(),
		fieldName = random.word(),
		data = { id, field: fieldName };

	before(async() => {
		await db.resetTable('fields');
		return random.field(data);
	});


	describe('has a create method', () => {
		const specificId = random.guid(),
			specificField = random.word(),
			createData = { id: specificId, field: specificField };
		let field;

		before(async() => field = await Fields.create(createData));

		it('should create a new field record if given valid data, create new created_at and updated_at fields, and return the field object', async() => {
			expect(field).to.be.an.object();
			expect(field.id).to.equal(specificId);
			expect(field.field).to.equal(specificField);
			expect(field.created_at).to.be.a.date();
			expect(field.updated_at).to.equal(null);
		});
	});


	describe('has a findOne method', () => {
		it('should retrive a specific field record if given a correct id', async() => {
			const field = await Fields.findOne(id);
			expect(field).to.be.an.object();
			expect(field.id).to.equal(id);
			expect(field.field).to.equal(fieldName);
		});

		it('should return an empty object if not found', async() => {

			const field = await Fields.findOne(random.guid());

			expect(field).to.be.an.object();
			expect(field.id).to.equal(undefined);
			expect(field.field).to.equal(undefined);
		});
	});


	describe('has an update method', () => {

		it('should update a field record if given a valid id and field', async() => {
			const specificId = random.guid(),
				specificField = random.word(),
				newFieldName = random.word(),
				createData = { id: specificId, field: specificField },
				updateData = { field: newFieldName };

			await random.field(createData);
			const oldField = await Fields.findOne(specificId);

			expect(oldField).to.be.an.object();
			expect(oldField.id).to.equal(specificId);
			expect(oldField.field).to.equal(specificField);
			expect(oldField.updated_at).to.equal(null);

			await Fields.update(specificId, updateData);
			const newField = await Fields.findOne(specificId);

			expect(newField).to.be.an.object();
			expect(newField.id).to.equal(specificId);
			expect(newField.field).to.equal(newFieldName);
			expect(newField.updated_at).to.be.a.date();
		});
	});


	describe('has a delete method', () => {
		it('should delete a field record if given a proper id', async() => {
			const specificId = random.guid();
			await random.field({ id: specificId });

			const field = await Fields.findOne(specificId);
			expect(field).to.be.an.object();
			expect(field.id).to.equal(specificId);

			await Fields.delete(specificId);
			const afterDelete = await Fields.findOne(specificId);

			expect(afterDelete).to.be.an.object();
			expect(afterDelete.id).to.equal(undefined);
		});
	});


});
