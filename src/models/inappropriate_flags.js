'use strict';


const Model = require('./model');
const InappropriateFlags = new Model('inappropriate_flags');


module.exports = {
	// TODO: May have to create specific methods for flags about freelancers, clients, jobs, etc. This way it will be a little more consistent on what tables get joined and for what queries. ex: findAllClients and findAllJobs that are flagged. Perhaps respectice create methods as well. May infact be more sensible to have a


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},

	// TODO: To be updated later, will mostly likely have to create a specific method to deal with all of the joins and determine what tables need to be joined
	findOne (id) {
		return InappropriateFlags.findOne(id);
	},

	create (data) {
		return InappropriateFlags.create(data);
	},

	update (id, data) {
		return InappropriateFlags.updateById(id, data);
	},

	delete (id) {
		return InappropriateFlags.delete(id);
	}

};
