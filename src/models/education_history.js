'use strict';


const Model = require('./main_model');
const EducationHistory = new Model('education_history');


module.exports = {
	// get all the education_history for one user
	getAll (freelancer_id) {
		return EducationHistory.findHistory(freelancer_id);
	},

	findOne (id) {
		return EducationHistory.findOne(id);
	},

	// TODO: Limit on number of records per freelancer?
	create (data) {
		return EducationHistory.create(data);
	},

	update (id, data) {
		return EducationHistory.updateById(id, data);
	},

	delete (id) {
		return EducationHistory.delete(id);
	}

};
