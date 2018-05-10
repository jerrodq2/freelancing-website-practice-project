'use strict';


const knex = require('../config/knex');
const Model = require('./model');
const SavedClients = new Model('saved_clients');


module.exports = {


	getAll () {
		// TODO: to be setup with pagination later
	},

	findOne (id) {
		const savedClientsColumns = ['saved_clients.*'];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const selectedColumns = savedClientsColumns.concat(freelancerColumns, clientColumns);
		return knex('saved_clients')
			.select(selectedColumns)
			.where(knex.raw(`saved_clients.id = '${id}'`))
			.innerJoin('freelancers as f', 'saved_clients.freelancer_id', 'f.id')
			.innerJoin('client as c', 'saved_clients.client_id', 'c.id')
			.then((result) => result[0]);
	},

	create (data) {
		return SavedClients.create(data);
	},

	update (id, data) {
		return SavedClients.updateById(id, data);
	},

	delete (id) {
		return SavedClients.delete(id);
	}

};
