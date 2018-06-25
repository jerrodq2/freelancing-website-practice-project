'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FreelancerSkills = require(`${process.cwd()}/src/models/freelancer_skills`);
const { db, random, knex, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Freelancer Skills Model', () => {
	const id = random.guid(),
		freelancer_id = random.guid(),
		skill_id = random.guid(),
		skill_alias = random.word(),
		data = { id, freelancer_id, skill_id, skill_alias };

	before(async() => {
		await db.resetTable('freelancer_skills');
		await random.freelancer({ id: freelancer_id });
		await random.skill({ id: skill_id });
		await random.freelancer_skill(data);
	});
	describe('has a create method', () => {
		it('test', async() => {
			expect(true).to.equal(true);
		});
	});


	describe('has a findOne method', () => {

	});


	describe('has a getAll method', () => {

	});


	describe('has an update method', () => {

	});


	describe('has a delete method', () => {

	});


	describe('has cascading delete on freelancer_id and skill_id', () => {

	});
});
