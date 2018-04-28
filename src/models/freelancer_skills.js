'use strict';


const Model = require('./model');
const Freelancer_skills = new Model('freelancer_skills');


module.exports = {

	getAll () {
		// determine if this is necessary, perhaps a getAll by freelancer id? Or another getAll method by skill id?
	},

	findOne (id) {
		return Freelancer_skills.findOne(id);
	},

	create (data) {
		return Freelancer_skills.create(data);
	},

	update (id, data) {
		return Freelancer_skills.updateById(id, data);
	},

	delete (id) {
		return Freelancer_skills.delete(id);
	}

};
