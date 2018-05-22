'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const Skills = new Model('skills');


module.exports = {

	getAll () {
		// TODO: determine if this is necessary
	},

	findOne (id) {
		return Skills.findOne(id);
	},

	findByName (name) {
		return knex('skills').where({ skill: name })
			.then((array) => {
				const result = array[0] ? array[0] : {};
				return result;
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
