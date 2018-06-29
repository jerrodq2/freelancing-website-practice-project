'use strict';


const MainModel = require('./main_model');
const knex = require('../config/knex');
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const Errors = require(`${process.cwd()}/src/lib/errors`);
const { toSingular } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// a specific class that extends the MainModel, used only for the saved_clients and saved_freelancers models, to abstract re-used code and improve DRYness
class SavedUserModel extends MainModel {
	constructor (tableName) {
		super(tableName);
		this.tableName = tableName;
	}


	async saveUser (data) {
		const { id, freelancer_id, client_id } = data,
			queryData = { id, freelancer_id, client_id };

		// first we check to see if this freelancer has already saved this client
		const check = await knex(`${this.tableName}`).where(queryData)
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'create');
				// the cause of the error is most likely a missing freelancer_id if this passes
				if (!freelancer_id)
					throw Errors.badNull(toSingular(this.tableName), 'create', 'freelancer_id');
				// the cause of the error is most likely a missing client_id if this passes
				if (!client_id)
					throw Errors.badNull(toSingular(this.tableName), 'create', 'client_id');
				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});

		if (check[0]) {
			// if so, then we raise an exception, they can only save a client once
			const message = `The ${toSingular(this.tableName)} you are trying to create can't be completed. This freelancer has already saved the client: ${client_id}`;

			throw Errors.Boom.badRequest(message);
		}

		return this.create(data);
	}


	getAll () {
		// TODO: grabs all of the saved_clients for a freelancer or all of the saved_freelancers for a client, to be setup with pagination later, could be separated into two different methods. Add to tests accordingly
	}


	findSavedUser (id) {
		const savedClientsColumns = [`${this.tableName}.*`];
		const freelancerColumns = ['f.id as freelancer_id', 'f.first_name as freelancer_first_name', 'f.last_name as freelancer_last_name'];
		const clientColumns = ['c.id as client_id', 'c.first_name as client_first_name', 'c.last_name as client_last_name'];
		const selectedColumns = savedClientsColumns.concat(freelancerColumns, clientColumns);
		return knex(`${this.tableName}`)
			.select(selectedColumns)
			.where(knex.raw(`${this.tableName}.id = '${id}'`))
			.innerJoin('freelancers as f', `${this.tableName}.freelancer_id`, 'f.id')
			.innerJoin('clients as c', `${this.tableName}.client_id`, 'c.id')
			.then((result) => {
				// throw error if the record with the given id couldn't be found
				if (!result[0]) throw Errors.notFound(toSingular(this.tableName), 'find');

				return result[0];
			})
			.catch((err) => {
				// throw error if the id wasn't given in proper uuid format
				if (Errors.violatesIdSyntax(err))
					throw Errors.badId(toSingular(this.tableName), 'find');

				// if the cause of the error wasn't found above, throw the given error
				throw err;
			});
	}

}


module.exports = SavedUserModel;
