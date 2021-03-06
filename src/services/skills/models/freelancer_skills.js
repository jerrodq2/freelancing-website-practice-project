'use strict';


// This file creates the freelancer_skills model with the standard methods
const knex = require(`${process.cwd()}/src/config/knex`);
const Model = require(`${process.cwd()}/src/services/main_model`);
const Skills = require('./skills');
const FreelancerSkills = new Model('freelancer_skills');
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);


// there is no update on this model due to the confusion that could happen between updating a skill_alias but not the skill it is linked to or vice versa
module.exports = {
	async create (data) {
		let skill, newSkill, skillId, wasSkillCreated = false;

		// a premptive check to see if the 'skill/skill_alias' field was passed. If not, it errors out in the toLowerCase method below, so we skip any db work and throw an error here
		if (!data.skill) throw Errors.badNull('freelancer_skill', 'create', 'skill');

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

		// If the skill already existed, we check to see if the freelancer doesn't already have it. If we just created the skill above (wasSkillCreated = true) then we can skip this if statement
		if (!wasSkillCreated) {
			// now that we have the skillId, we make sure that the freelancer doesn't already have this skill
			const checkOnFreelancer = await knex('freelancer_skills').where(finalData).then((result) => result[0])
				.catch((err) => {
					// throw error if the id wasn't given in proper uuid format
					if (Errors.violatesIdSyntax(err))
						throw Errors.badId(toSingular('freelancer_skill'), 'create');
				});

			// if the freelancer already has this skill we raise an exception
			if (checkOnFreelancer) {
				const message = `The freelancer_skill you are trying to create can't be completed, this freelancer already has the skill: ${data.skill}.`;

				throw Errors.Boom.badRequest(message);
			}
		}

		//apend the skill_alias to the finalData object
		finalData.skill_alias = data.skill;
		return FreelancerSkills.create(finalData);
	},


	// TODO: return anything if there are no skills? To be determined when used by the view through a route, will have a better idea by then
	// get all freelancer_skills for a single freelancer. A freelancer can only have a max of 20, so pagination isn't needed. Get's passed a freelancer_id
	getAll (id) {
		return knex('freelancer_skills').where({ freelancer_id: id })
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('freelancer_skill', 'getAll');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	},


	findOne (id) {
		return FreelancerSkills.findOne(id);
	},


	delete (id) {
		return FreelancerSkills.delete(id);
	}

};
