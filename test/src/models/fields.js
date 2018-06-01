'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Fields = require(`${process.cwd()}/src/models/fields`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Fields Model', () => {
	const id = random.guid(),
		fieldName = random.word(),
		data = { id, field: fieldName };

	before(async() => {
		await db.resetTable('fields');
		return random.field(data);
	});


	describe('has a create method', () => {
		it('should create a new field record if given valid data, create new created_at and updated_at fields, and return the field object', async() => {
			const specificId = random.guid(),
				specificField = random.word(),
				createData = { id: specificId, field: specificField },
				field = await Fields.create(createData);

			expect(field).to.be.an.object();
			expect(field.id).to.equal(specificId);
			expect(field.field).to.equal(specificField);
			expect(field.created_at).to.be.a.date();
			expect(field.updated_at).to.equal(null);
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = { id: 1, field: random.word() };

			return checkErr.checkIdFormat(Fields, 'field', 'create', createData);
		});

		it('should require a field to create', async() => {
			return checkErr.checkNotNull(Fields, 'field', { id: random.guid() }, 'field');
		});

		it('should raise an exception if the field isn\'t unique (unique field)', async() => {
			return checkErr.checkUnique(Fields, 'field', { id: random.guid() }, 'field', fieldName);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific field with a given id, and return an object', async() => {
			const field = await Fields.findOne(id);
			expect(field).to.be.an.object();
			expect(field.id).to.equal(id);
			expect(field.field).to.equal(fieldName);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Fields, 'field', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Fields, 'field', 'find', {});
		});
	});


	describe('has an update method', () => {
		it('should update the field record if given a valid id and data, and return the updated object', async() => {
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

			const newField = await Fields.update(specificId, updateData);

			expect(newField).to.be.an.object();
			expect(newField.id).to.equal(specificId);
			expect(newField.field).to.equal(newFieldName);
			expect(newField.updated_at).to.be.a.date();
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Fields, 'field', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Fields, 'field', 'update', {});
		});
	});


	describe('has a delete method', () => {
		it('should delete a field record if given a proper id and return true if successful', async() => {
			const specificId = random.guid();
			await random.field({ id: specificId });

			const field = await Fields.findOne(specificId);
			expect(field).to.be.an.object();
			expect(field.id).to.equal(specificId);

			const afterDelete = await Fields.delete(specificId);
			expect(afterDelete).to.equal(true);
			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Fields, 'field', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Fields, 'field', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Fields, 'field', 'delete', {});
		});
	});
});
