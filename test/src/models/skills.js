'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Skills = require(`${process.cwd()}/src/models/skills`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);


describe('Skills Model', () => {
	const id = random.guid(),
		skill = random.word(),
		data = { id, skill };

	before(async() => {
		await db.resetTable('skills');
		return random.skill(data);
	});

	describe('has a create method', () => {
		const specificId = random.guid(),
			specificSkill = random.word(),
			newData = { id: specificId, skill: specificSkill };
		let result, record;

		before(async() => {
			await Skills.create(newData);
			result = await knex('skills').where({ id: specificId });
			record = result[0];
		});

		it('should create a new skill if given a proper id and skill', async() => {
			expect(record).to.be.an.object();
			expect(record.id).to.equal(specificId);
			expect(record.skill).to.equal(specificSkill);
		});

		it('should create the new skill record with new created_at and update_at fields', async() => {
			expect(record.created_at).to.be.a.date();
			expect(record.updated_at).to.equal(null);
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific skill record if given a correct id', async() => {
			const result = await Skills.findOne(id);
			expect(result).to.be.an.object();
			expect(result.id).to.equal(id);
			expect(result.skill).to.equal(skill);
		});

		it('should return an empty object if not found', async() => {
			const result = await Skills.findOne(random.guid());

			expect(result).to.be.an.object();
			expect(result.id).to.equal(undefined);
			expect(result.skill).to.equal(undefined);
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
		it('should update the skill record if given a valid id and skill', async() => {
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

			await Skills.update(specificId, updateData);
			const updatedSkill = await Skills.findOne(specificId);


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

			await Skills.delete(specificId);
			const afterDelete = await Skills.findOne(specificId);

			expect(afterDelete).to.be.an.object();
			expect(afterDelete.id).to.equal(undefined);
		});
	});

});