'use strict';


// This file creates the skills model with the standard methods
const knex = require(`${process.cwd()}/src/config/knex`);
const Model = require(`${process.cwd()}/src/services/main_model`);
const Skills = new Model('skills');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {

	getAll () {
		// TODO: determine if this is necessary
	},

	findOne (id) {
		return Skills.findOne(id);
	},

	findByName (name) {
		const lowerCaseName = name.toLowerCase();
		return knex('skills').where({ skill: lowerCaseName })
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound('skill', 'findByName', 'skill name');

				return result[0];
			});
	},

	create (data) {
		return Skills.create(data);
	},

	update (id, data) {
		return Skills.updateById(id, data);
	},

	delete (id) {
		return Skills.delete(id);
	}

};
