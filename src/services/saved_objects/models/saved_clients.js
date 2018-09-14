'use strict';


const Model = require('./saved_user_model');
const SavedClients = new Model('saved_clients');


// this model doesn't have an update method, seems more logical to simply allow them to delete and save another client than have to worry about updating anything
module.exports = {
	create (data) {
		return SavedClients.saveUser(data);
	},


	getAll () {
		// TODO: grab all of the saved_clients for a freelancer, to be setup with pagination later through the saved_user_model
	},


	findOne (id) {
		return SavedClients.findSavedUser(id);
	},


	delete (id) {
		return SavedClients.delete(id);
	}
};
