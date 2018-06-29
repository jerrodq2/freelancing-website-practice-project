'use strict';


const knex = require('../config/knex');
const Model = require('./main_model');
const SavedClients = new Model('saved_clients');
const Errors = require(`${process.cwd()}/src/lib/errors`);


module.exports = {
	async create (data) {
		const { id, freelancer_id, client_id } = data,
			queryData = { id, freelancer_id, client_id };

		// first we check to see if this freelancer has already saved this client
		const check = await knex('saved_clients').where(queryData)
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId('saved_client', 'create');

				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull('saved_clients', 'create', 'freelancer_id');

				// the cause of the error is most likely a missing client_id if this passes
				if (!client_id)
					throw Errors.badNull('saved_clients', 'create', 'client_id');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		if (check[0]) {
			// if so, then we raise an exception, they can only save a client once
			const message = `The saved_client you are trying to create can't be completed. This freelancer has already saved the client: ${client_id}`;

			throw Errors.Boom.badRequest(message);
		}

		return SavedClients.create(data);
	},


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


	update (id, data) {
		return SavedClients.updateById(id, data);
	},


	delete (id) {
		return SavedClients.delete(id);
	}
};
