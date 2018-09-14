'use strict';


const Model = require('./saved_user_model');
const SavedFreelancers = new Model('saved_freelancers');


// this model doesn't have an update method, seems more logical to simply allow them to delete and save another freelancer than have to worry about updating anything
module.exports = {
	create (data) {
		return SavedFreelancers.saveUser(data);
	},


	getAll () {
		// TODO: grab all of the saved_freelancers for a client, to be setup with pagination later through the saved_user_model
	},


	findOne (id) {
		return SavedFreelancers.findSavedUser(id);
	},


	delete (id) {
		return SavedFreelancers.delete(id);
	}

};
