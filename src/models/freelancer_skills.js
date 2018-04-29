'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const Skills = require('./skills');
const Freelancer_skills = new Model('freelancer_skills');


module.exports = {

	getAll () {
		// determine if this is necessary, perhaps a getAll by freelancer id? Or another getAll method by skill id?
	},


	findOne (id) {
		return Freelancer_skills.findOne(id);
	},


	async create (data) {
		let skillId, wasSkillCreated = false;
		// first we check to see if this skill already exists in the db, if not, we create it
		data.skill = data.skill.toLowerCase();
		const skill = await Skills.findByName(data.skill);

		if (!skill) {
			const newSkill = await Skills.create(data.skill);
			wasSkillCreated = true;
			skillId = newSkill.id;
		} else {
			skillId = skill.id;
		}
		// If we just created the given skill, then the freelancer can't already have the skill so the below check is meaningless and we skip
		const finalData = { freelancer_id: data.freelancer_id, skill_id: skillId };
		if (!wasSkillCreated) {
			// now that we have the skillId, we make sure that the freelancer doesn't already have this skill
			const checkOnFreelancer = await knex('freelancer_skills').where(finalData).then((result) => result[0]);
			// if the freelancer already has this skill we return
			if (checkOnFreelancer) return false; // look into more appropriate message upon return
		}
		return Freelancer_skills.create(finalData);
	},


	update (id, data) {
		return Freelancer_skills.updateById(id, data);
	},


	delete (id) {
		return Freelancer_skills.delete(id);
	}

};
