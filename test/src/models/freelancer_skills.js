'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FreelancerSkills = require(`${process.cwd()}/src/models/freelancer_skills`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe.only('Freelancer Skills Model', () => {
	const id = random.guid(),
		freelancer_id = random.guid(),
		skill_id = random.guid(),
		skill = random.word(),
		data = { id, freelancer_id, skill };

	before(async() => {
		await db.resetTable('freelancer_skills');
		await random.freelancer({ id: freelancer_id });
		await random.skill({ id: skill_id, skill });
		await random.freelancer_skill(data);
	});


	// creates the necessary unique variables to create a new freelancer_skill record and adds it to the above data object
	const createNewData = async() => {
		const specificId = random.guid(),
			specificSkill = random.word(),
			skill_id = random.guid(),
			obj = { id: specificId, skill: specificSkill, skill_id },
			createData = Object.assign({}, data, obj);

		await random.skill({ id: skill_id, skill: specificSkill });

		return createData;
	};


	// checks all fields in a given freelancer_skill
	const checkFields = (obj, givenId, givenSkill, givenSkillId = skill_id) => {
		expect(obj).to.be.an.object();
		expect(obj.id).to.equal(givenId);
		expect(obj.freelancer_id).to.equal(freelancer_id);
		expect(obj.skill_id).to.equal(givenSkillId);
		expect(obj.skill_alias).to.equal(givenSkill);
		expect(obj.created_at).to.be.a.date();
		expect(obj.updated_at).to.equal(null);
	};


	describe('has a create method', () => {
		it('should create a new freelancer_skill record if given valid data, create new created_at and updated_at fields, and return the admin object without the username or password', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificSkill = createData.skill,
				skillId = createData.skill_id,
				freelancerSkill = await FreelancerSkills.create(createData);

			checkFields(freelancerSkill, specificId, specificSkill, skillId);
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
