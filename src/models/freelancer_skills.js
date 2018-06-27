'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Skills = require('./skills');
const FreelancerSkills = new Model('freelancer_skills');
const { Boom } = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	async create (data) {
		let skill, newSkill, skillId, wasSkillCreated = false;

		try {
			// we first check to see if the skill already exists, if so then we save the id to be used later
			skill = await Skills.findByName(data.skill);
			skillId = skill.id;
		} catch (err) {
			// if the skill doesn't exist, we create it, and change the wasSkillCreated variable to be true, affecting a check below
			newSkill = await Skills.create({ skill: data.skill.toLowerCase() });

			wasSkillCreated = true;
			skillId = newSkill.id;
		}

		const finalData = { id: data.id, freelancer_id: data.freelancer_id, skill_id: skillId };

		// If the skill already existed, we check to see if the freelancer doesn't already have it. If we just created the skill above (wasSkillCreated = true) then we can skill this if statement
		if (!wasSkillCreated) {
			// now that we have the skillId, we make sure that the freelancer doesn't already have this skill
			const checkOnFreelancer = await knex('freelancer_skills').where(finalData).then((result) => result[0]);

			// if the freelancer already has this skill we raise an exception
			if (checkOnFreelancer) {
				const message = `The freelancer_skill you are trying to create can't be completed, this freelancer already has the skill: ${data.skill}.`;

				throw Boom.badRequest(message);
			}
		}

		//apend the skill_alias to the finalData object
		finalData.skill_alias = data.skill;
		return FreelancerSkills.create(finalData);
	},


	getAll () {
		// TODO: determine if this is necessary, perhaps a getAll by freelancer id? Or another getAll method by skill id?
	},


	findOne (id) {
		return FreelancerSkills.findOne(id);
	},


	update (id, data) {
		return FreelancerSkills.updateById(id, data);
	},


	delete (id) {
		return FreelancerSkills.delete(id);
	}

};
