'use strict';


const Model = require('./model');
const educationHistory = new Model('education_history');


module.exports = {
	// get all the education_history for one user
	getAll (freelancer_id) {
		return educationHistory.findHistory(freelancer_id);
	},

	findOne (id) {
		return educationHistory.findOne(id);
	},

	create (data) {
		return educationHistory.create(data);
	},

	update (id, data) {
		return educationHistory.updateById(id, data);
	},

	delete (id) {
		return educationHistory.delete(id);
	}

};
