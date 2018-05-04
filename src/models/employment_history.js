'use strict';


const Model = require('./model');
const EmploymentHistory = new Model('employment_history');


module.exports = {
	// get all the employment_history for one user
	getAll (freelancer_id) {
		return EmploymentHistory.findHistory(freelancer_id);
	},

	findOne (id) {
		return EmploymentHistory.findOne(id);
	},
	
	// TODO: Limit on number of records per freelancer?
	create (data) {
		return EmploymentHistory.create(data);
	},

	update (id, data) {
		return EmploymentHistory.updateById(id, data);
	},

	delete (id) {
		return EmploymentHistory.delete(id);
	}

};
