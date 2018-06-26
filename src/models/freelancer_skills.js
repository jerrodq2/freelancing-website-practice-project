'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Skills = require('./skills');
const FreelancerSkills = new Model('freelancer_skills');


module.exports = {
	async create (data) {
		let skill, newSkill, skillId, wasSkillCreated = false;
		// first we check to see if this skill already exists in the db, if not, we create it
		const lowercase = data.skill.toLowerCase();

		try {
			// we first check to see if the skill already exists, if so then we save the id to be used later
			skill = await Skills.findByName(lowercase);
			skillId = skill.id;
		} catch (err) {
			// if the skill doesn't exist, we create it, and change the two below variables to reflect it
			newSkill = await Skills.create({ skill: lowercase });
			wasSkillCreated = true;
			skillId = newSkill.id;
		}

		const finalData = { id: data.id, freelancer_id: data.freelancer_id, skill_id: skillId };

		// If we just created the given skill, then the freelancer can't already have the skill so the below check is meaningless and we skip
		if (!wasSkillCreated) {
			// now that we have the skillId, we make sure that the freelancer doesn't already have this skill
			const checkOnFreelancer = await knex('freelancer_skills').where(finalData).then((result) => result[0]);
			// if the freelancer already has this skill we return
			if (checkOnFreelancer) return false; // look into more appropriate message upon return
		}
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
