'use strict';


// This file creates the education_history model with the standard methods
const Model = require(`${process.cwd()}/src/services/main_model`);
const EducationHistory = new Model('education_history');


module.exports = {
	// TODO: Limit on number of records per freelancer? ex: can only have up to 10 employment_history records per freelancer
	create (data) {
		return EducationHistory.create(data);
	},

	// get all the education_history for one user
	findHistory (freelancer_id) {
		return EducationHistory.findHistory(freelancer_id);
	},

	findOne (id) {
		return EducationHistory.findOne(id);
	},

	// TODO: No reason to update/change the freelancer_id, some check to stop that?
	update (id, data) {
		return EducationHistory.updateById(id, data);
	},

	delete (id) {
		return EducationHistory.delete(id);
	}

};
