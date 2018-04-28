'use strict';


const Model = require('./model');
const Skills = new Model('skills');


module.exports = {

	getAll () {
		// determine if this is necessary
	},

	findOne (id) {
		return Skills.findOne(id);
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
