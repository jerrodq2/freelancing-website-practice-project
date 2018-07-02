'use strict';


const { expect } = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const FreelancerSkills = require(`${process.cwd()}/src/models/freelancer_skills`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);
const Skills = require(`${process.cwd()}/src/models/skills`);
const { db, random, checkErr } = require(`${process.cwd()}/test/src/helpers`);


describe('Freelancer Skills Model', () => {
	const id = random.guid(),
		freelancer_id = random.guid(),
		skill_id = random.guid(),
		skill = `skill name-${random.guid().substring(0, 16)}`,
		data = { id, freelancer_id, skill };

	before(async() => {
		await db.resetTable('skills');
		await db.resetTable('freelancer_skills');
		await random.freelancer({ id: freelancer_id });
		await random.skill({ id: skill_id, skill });
		await random.freelancer_skill(data);
	});


	// creates the necessary unique variables to create a new freelancer_skill record and adds it to the above data object
	const createNewData = async() => {
		const specificId = random.guid(),
			skill_id = random.guid(), //not used to create the freelancer_skill, only used in the expect statements
			specificSkill = `skill name-${random.guid().substring(0, 16)}`,
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
		it('should create a new freelancer_skill record if given valid data, create new created_at and updated_at fields, and return the freelancer_skill object', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificSkill = createData.skill,
				skillId = createData.skill_id,
				freelancerSkill = await FreelancerSkills.create(createData);

			checkFields(freelancerSkill, specificId, specificSkill, skillId);
		});


		it('should create the skill upon the freelnacer_skill create if the skill didn\'t already exist. It should also, save the skill as lowercase in the skill table, but save the original word format in the \'skill_alias\' field in the freelancer_skills table', async() => {
			const specificId = random.guid(),
				specificSkill = 'HTML',
				obj = { id: specificId, skill: specificSkill },
				createData = Object.assign({}, data, obj);

			// ensure that the skill doesn't yet exist
			try {
				await Skills.findByName('HTML');
			} catch (err) {
				checkErr.checkMessage(err, 'skill', 'findByName', 'skill name', 'does not exist', 'not found');
			}

			const freelancerSkill = await FreelancerSkills.create(createData);
			expect(freelancerSkill).to.be.an.object();
			expect(freelancerSkill.id).to.equal(specificId);
			expect(freelancerSkill.skill_alias).to.equal('HTML');

			const skill = await Skills.findByName('HTML');
			expect(skill).to.be.an.object();
			expect(skill.skill).to.equal('html');

			expect(freelancerSkill.skill_id).to.equal(skill.id);
		});


		it('shouldn\'t allow a freelancer to have the same skill twice, it should raise an execption upo trying to create a freelancer_skill with duplicate freelancer_id and skill_id values', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificSkill = createData.skill,
				skillId = createData.skill_id,
				freelancerSkill = await FreelancerSkills.create(createData);

			checkFields(freelancerSkill, specificId, specificSkill, skillId);

			try {
				await FreelancerSkills.create(createData);
			} catch (err) {
				expect(err).to.be.an.object();
				const { message } = err;

				expect(message).to.be.a.string();
				expect(message).to.include('freelancer_skill');
				expect(message).to.include('trying to create can\'t be completed');
				expect(message).to.include('already has the skill');
				expect(message).to.include(specificSkill);
			}
		});

		it('should raise an exception if given an invalid id (not in uuid format', async() => {
			const createData = await createNewData();
			createData.id = 1;

			return checkErr.checkIdFormat(FreelancerSkills, 'freelancer_skill', 'create', createData);
		});


		it('should require the freelancer_id to create', async() => {
			const createData = await createNewData();
			return checkErr.checkNotNull(FreelancerSkills, 'freelancer_skill', createData, 'freelancer_id');
		});

		it('should require the skill_alias to create', async() => {
			const createData = await createNewData();
			// passed to the create method as 'skill'
			return checkErr.checkNotNull(FreelancerSkills, 'freelancer_skill', createData, 'skill');
		});


		it('should raise an exception if given an incorrect freelancer_id (foreign key not found)', async() => {
			const createData = await createNewData();
			return checkErr.checkForeign(FreelancerSkills, 'freelancer_skill', 'create', createData, 'freelancer_id', random.guid());
		});
	});


	describe('has a findOne method', () => {
		it('should retrieve a specific freelancer_skill with a given id, and return the object', async() => {
			const freelancerSkill = await FreelancerSkills.findOne(id);
			checkFields(freelancerSkill, id, skill);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FreelancerSkills, 'freelancer_skill', 'find', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FreelancerSkills, 'freelancer_skill', 'find', {});
		});
	});


	describe('has a getAll method', () => {
		const specificFreelancerId = random.guid(),
			specificSkill = random.word();

		before(async() => {
			await random.freelancer({ id: specificFreelancerId });
			await random.freelancer_skill({ skill: specificSkill, freelancer_id: specificFreelancerId }); // so we can test at least the first skill
			await random.freelancer_skills(10, { freelancer_id: specificFreelancerId });
		});

		it('should find all of the freelancer_skills belonging to a single freelancer and return an array of objects', async() => {
			const skills = await FreelancerSkills.getAll(specificFreelancerId);

			expect(skills).to.be.an.array();
			expect(skills.length).to.equal(11);
			expect(skills[0]).to.be.an.object();
			expect(skills[0].freelancer_id).to.equal(specificFreelancerId);
			expect(skills[0].skill_alias).to.equal(specificSkill);
		});

		it('should return an empty array if there are not skills for that freelancer', async() => {
			const secondId = random.guid();
			await random.freelancer({ id: secondId });

			const skills = await FreelancerSkills.getAll(secondId);
			expect(skills).to.be.an.array();
			expect(skills.length).to.equal(0);
		});
	});


	describe('has a delete method', () => {
		it('should delete the record if given a correct id and return true if successful', async() => {
			const createData = await createNewData(),
				specificId = createData.id;

			const freelancerSkill = await random.freelancer_skill(createData);
			expect(freelancerSkill).to.be.an.object();
			expect(freelancerSkill.id).to.equal(specificId);

			const result = await FreelancerSkills.delete(specificId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerSkills, 'freelancer_skill', 'find', specificId);
		});

		it('should raise an exception if given an incorrect id (not found)', async() => {
			return checkErr.checkNotFound(FreelancerSkills, 'freelancer_skill', 'delete', random.guid());
		});

		it('should raise an exception when given an invalid id (not in uuid format)', async() => {
			return checkErr.checkIdFormat(FreelancerSkills, 'freelancer_skill', 'delete', {});
		});
	});


	describe('has cascading delete on freelancer_id and skill_id', () => {
		it('should be deleted in the event of the freelancer who it is associated with is deleted', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificFreelancerId = random.guid();
			createData.freelancer_id = specificFreelancerId;

			await random.freelancer({ id: specificFreelancerId });
			const freelancerSkill = await FreelancerSkills.create(createData);

			expect(freelancerSkill).to.be.an.object();
			expect(freelancerSkill.id).to.equal(specificId);
			expect(freelancerSkill.freelancer_id).to.equal(specificFreelancerId);

			const result = await Freelancers.delete(specificFreelancerId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerSkills, 'freelancer_skill', 'find', specificId);
		});


		it('should be deleted in the event of the skill who it is associated with is deleted', async() => {
			const createData = await createNewData(),
				specificId = createData.id,
				specificSkillId = createData.skill_id;

			const freelancerSkill = await FreelancerSkills.create(createData);

			expect(freelancerSkill).to.be.an.object();
			expect(freelancerSkill.id).to.equal(specificId);
			expect(freelancerSkill.skill_id).to.equal(specificSkillId);

			const result = await Skills.delete(specificSkillId);
			expect(result).to.equal(true);

			// check that trying to find the record now returns a not found error
			return checkErr.checkNotFound(FreelancerSkills, 'freelancer_skill', 'find', specificId);
		});
	});
});
