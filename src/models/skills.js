'use strict';


const knex = require('../config/knex');
const Model = require('./model');
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
			.then((result) => result[0]);
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
