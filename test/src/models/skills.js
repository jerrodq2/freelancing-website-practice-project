'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const Skills = require(`${process.cwd()}/src/models/skills`);
const { db, random, knex } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Skills Model', () => {
	const id = random.guid(),
		skill = random.word(),
		data = { id, skill };

	before(async() => {
		await db.resetAll();
		return random.skill(data);
	});

	describe('has a create method', () => {
		const specificId = random.guid(),
			specificSkill = random.word(),
			newData = { id: specificId, skill: specificSkill };

		before(() => Skills.create(newData));

		it('should create a new skill if given a proper id and skill, with a created_at and update_at field', async() => {
			const result = await knex('skills').where({ id: specificId });
			const record = result[0];

			expect(record).to.be.an.object();
			expect(record.id).to.equal(specificId);
			expect(record.skill).to.equal(specificSkill);
			expect(record.created_at).to.be.a.date();
			expect(record.updated_at).to.equal(null);
		});
	});

});
