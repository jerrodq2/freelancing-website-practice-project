'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
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
		return knex('skills').where({ skill: name })
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
