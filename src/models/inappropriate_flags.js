'use strict';


const Model = require('./main_model');
const InappropriateFlags = new Model('inappropriate_flags');


module.exports = {
	// TODO: May have to create specific methods for flags about freelancers, clients, jobs, etc. This way it will be a little more consistent on what tables get joined and for what queries. ex: findAllClients and findAllJobs that are flagged. Perhaps respective create methods as well. May infact be more sensible to have tables for each table, ex: flagged_clients, flagged_jobs, etc. TBD upon actually working with the data.
	create (data) {
		return InappropriateFlags.create(data);
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	// TODO: To be updated later, will mostly likely have to create a specific method to deal with all of the joins and determine what tables need to be joined
	findOne (id) {
		return InappropriateFlags.findOne(id);
	},


	delete (id) {
		return InappropriateFlags.delete(id);
	}

};
