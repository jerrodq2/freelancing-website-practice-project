'use strict';


const Model = require('./flag_model');
const FlaggedClients = new Model('flagged_clients');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	// TODO: determine which parameter (client_who_flagged/freelancer_who_flagged) is is sent in the route (maybe two different routes?)
	async create (data) {
		// a premptive check, saves us trouble in the flag_model create method
		if (!data.client_id)
			throw Errors.badNull('flagged_client', 'create', 'client_id');

		return FlaggedClients.createFlag(data, 'client');
	},


	getAll () {
		// TODO: to be setup with pagination later, most likely only for admins
	},


	findOne (id) {
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'],
			joinText = ['clients as c', 'flagged_clients.client_id', 'c.id'];

		return FlaggedClients.findOneFlag(id, clientColumns, joinText);
	},


	delete (id) {
		return FlaggedClients.delete(id);
	}
};
