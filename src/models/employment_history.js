'use strict';


const Model = require(`${process.cwd()}/src/services/main_model`);
const EmploymentHistory = new Model('employment_history');


module.exports = {
	// TODO: Limit on number of records per freelancer? ex: can only have up to 10 employment_history records per freelancer
	create (data) {
		return EmploymentHistory.create(data);
	},

	// get all the employment_history for one user
	findHistory (freelancer_id) {
		return EmploymentHistory.findHistory(freelancer_id);
	},

	findOne (id) {
		return EmploymentHistory.findOne(id);
	},

	// TODO: No reason to update/change the freelancer_id, some check to stop that?
	update (id, data) {
		return EmploymentHistory.updateById(id, data);
	},

	delete (id) {
		return EmploymentHistory.delete(id);
	}

};
