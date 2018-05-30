'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Fields = require(`${process.cwd()}/src/models/fields`);
const { db, random } = require(`${process.cwd()}/test/src/helpers`);


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
			const specificId = 1,
				createData = { id: specificId, field: random.word() };

			try {
				await Fields.create(createData);
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});

		it('should require a field to create', async() => {
			const createData = { id: random.guid() };
			try {
				await Fields.create(createData);
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('not-null constraint');
				expect(err.message).to.include('\'field\'');
			}
		});

		it('should raise an exception if not using a unique field (duplicate field)', async() => {
			const createData = { id: random.guid(), field: fieldName };

			try {
				await Fields.create(createData);
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('unique constraint');
				expect(err.message).to.include('\'field\'');
			}
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
			try {
				await Fields.findOne(random.guid());
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('find');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			try {
				await Fields.findOne(1);
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('find');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('wasn\'t in proper uuid format');
			}
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
			try {
				await Fields.update(random.guid(), { field: random.word() });
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('update');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			try {
				await Fields.update(1, { field: random.word() });
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('update');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('wasn\'t in proper uuid format');
			}
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
			try {
				await Fields.findOne(specificId);
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('find');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			try {
				await Fields.delete(random.guid());
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('delete');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('id');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			try {
				await Fields.delete(1);
			} catch (err) {
				expect(err.message).to.include('field');
				expect(err.message).to.include('delete');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('wasn\'t in proper uuid format');
			}
		});
	});
});
