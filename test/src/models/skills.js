'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Skills = require(`${process.cwd()}/src/models/skills`);
const { db, random } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Skills Model', () => {
	const id = random.guid(),
		skill = random.word(),
		data = { id, skill };

	before(async() => {
		await db.resetTable('skills');
		return random.skill(data);
	});

	describe('has a create method', () => {
		it('should create a new skill record if given valid data, create new created_at and updated_at fields, and return the skill object', async() => {
			const specificId = random.guid(),
				specificSkill = random.word(),
				createData = { id: specificId, skill: specificSkill },
				result = await Skills.create(createData);

			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);
			expect(result.skill).to.equal(specificSkill);
			expect(result.created_at).to.be.a.date();
			expect(result.updated_at).to.equal(null);
		});

		it('should require a id in proper uuid format', async() => {
			const specificId = 1,
				createData = { id: specificId, skill: random.word() };

			try {
				await Skills.create(createData);
			} catch (err) {
				expect(err.message).to.include('skill');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});

		it('should require a skill to create', async() => {
			const createData = { id: random.guid() };

			try {
				await Skills.create(createData);
			} catch (err) {
				expect(err.message).to.include('skill');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('not-null constraint');
				expect(err.message).to.include('skill');
			}
		});

		it('should raise an exception if not using a unique skill (duplicate skill)', async() => {
			const createData = { id: random.guid(), skill };

			try {
				await Skills.create(createData);
			} catch (err) {
				expect(err.message).to.include('skill');
				expect(err.message).to.include('create');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('unique constraint');
				expect(err.message).to.include('skill');
			}
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific skill with a given id, and return an object', async() => {
			const result = await Skills.findOne(id);
			expect(result).to.be.an.object();
			expect(result.id).to.equal(id);
			expect(result.skill).to.equal(skill);
		});

		it('should raise an exception if not found', async() => {
			try {
				await Skills.findOne(random.guid());
			} catch (err) {
				expect(err.message).to.include('skill');
				expect(err.message).to.include('find');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('not found');
			}
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			try {
				await Skills.findOne(1);
			} catch (err) {
				expect(err.message).to.include('skill');
				expect(err.message).to.include('find');
				expect(err.message).to.include('couldn\'t be completed');
				expect(err.message).to.include('id');
				expect(err.message).to.include('proper uuid format');
			}
		});
	});


	describe('has a findByName method', () => {
		it('should retrieve a specific skill if given a correct skill name', async() => {
			const result = await Skills.findByName(skill);

			expect(result).to.be.an.object();
			expect(result.id).to.equal(id);
			expect(result.skill).to.equal(skill);
		});

		it('should return an empty object if not found', async() => {
			const result = await Skills.findByName('skill?');

			expect(result).to.be.an.object();
			expect(result.id).to.equal(undefined);
			expect(result.skill).to.equal(undefined);
		});
	});


	describe('has an update method', () => {
		it('should update the skill record if given a valid id and data, and return the updated object ', async() => {
			const specificId = random.guid(),
				specificSkill = random.word(),
				newSkill = random.word(),
				createData = { id: specificId, skill: specificSkill },
				updateData = { skill: newSkill };

			await random.skill(createData);
			const oldSkill = await Skills.findOne(specificId);

			expect(oldSkill).to.be.an.object();
			expect(oldSkill.id).to.equal(specificId);
			expect(oldSkill.skill).to.equal(specificSkill);
			expect(oldSkill.updated_at).to.equal(null);

			const updatedSkill =await Skills.update(specificId, updateData);

			expect(updatedSkill).to.be.an.object();
			expect(updatedSkill.id).to.equal(specificId);
			expect(updatedSkill.skill).to.equal(newSkill);
			expect(updatedSkill.updated_at).to.be.a.date();
		});
	});


	describe('has a delete method', () => {
		it('should delete a skill record if given a proper id', async() => {
			const specificId = random.guid();
			await random.skill({ id: specificId });

			const result = await Skills.findOne(specificId);
			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);

			const afterDelete = await Skills.delete(specificId);
			expect(afterDelete).to.equal(true);

			try {
				await Skills.findOne(specificId);
			} catch (err) {
				expect(err.message).to.include('skill');
				expect(err.message).to.include('find');
				expect(err.message).to.include('does not exist');
				expect(err.message).to.include('not found');
			}
		});
	});

});
