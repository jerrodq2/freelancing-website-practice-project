'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Skills = require(`${process.cwd()}/src/models/skills`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Skills Model', () => {
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

		it('should raise an exception if given an invalid id (not in uuid format)', async() => {
			const createData = { id: 1, skill: random.word() };

			return checkErr.checkIdFormat(Skills, 'skill', 'create', createData);
		});

		it('should require a skill to create', async() => {
			return checkErr.checkNotNull(Skills, 'skill', { id: random.guid() }, 'skill');
		});

		it('should raise an exception if the skill isn\'t unique (unique field)', async() => {
			const createData = { id: random.guid(), skill };

			return checkErr.checkUnique(Skills, 'skill', 'create', createData, 'skill', skill);
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
			return checkErr.checkNotFound(Skills, 'skill', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Skills, 'skill', 'find', {});
		});
	});


	describe('has a findByName method', () => {
		it('should retrieve a specific skill if given a correct skill name', async() => {
			const result = await Skills.findByName(skill);

			expect(result).to.be.an.object();
			expect(result.id).to.equal(id);
			expect(result.skill).to.equal(skill);
		});

		it('should raise an exception if not found', async() => {
			try {
				await Skills.findByName('skill?');
			} catch (err) {
				return checkErr.checkMessage(err, 'skill', 'findByName', 'skill name', 'does not exist', 'not found');
			}
		});
	});


	describe('has an update method', () => {
		const specificId = random.guid(); //used in the checkUnique error test below

		before(() => random.skill({ id: specificId }));

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

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Skills, 'skill', 'update', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Skills, 'skill', 'update', {});
		});

		it('should raise an exception if the skill isn\'t unique (unique field)', async() => {
			const createData = { id: random.guid(), skill };

			return checkErr.checkUnique(Skills, 'skill', 'update', createData, 'skill', skill, specificId);
		});
	});


	describe('has a delete method', () => {
		it('should delete a skill record if given a proper id and return true if successful', async() => {
			const specificId = random.guid();
			await random.skill({ id: specificId });

			const result = await Skills.findOne(specificId);
			expect(result).to.be.an.object();
			expect(result.id).to.equal(specificId);

			const afterDelete = await Skills.delete(specificId);
			expect(afterDelete).to.equal(true);
			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(Skills, 'skill', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(Skills, 'skill', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(Skills, 'skill', 'delete', {});
		});
	});

});
