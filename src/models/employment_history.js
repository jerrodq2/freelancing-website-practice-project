'use strict';


const Model = require('./model');
const employmentHistory = new Model('employment_history');


module.exports = {
	// get all the employment_history for one user
	getAll (freelancer_id) {
		return employmentHistory.findHistory(freelancer_id);
	},

	findOne (id) {
		return employmentHistory.findOne(id);
	},

	create (data) {
		return employmentHistory.create(data);
	},

	update (id, data) {
		return employmentHistory.updateById(id, data);
	},

	delete (id) {
		return employmentHistory.delete(id);
	}

};
