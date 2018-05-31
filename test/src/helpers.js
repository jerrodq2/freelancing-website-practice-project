'use strict';


const connectionOptions = require(`${process.cwd()}/knexfile.js`)[`${process.env.NODE_ENV}`];
const knex = require('knex')(connectionOptions);
const random = require(`${process.cwd()}/randoms`);
const { expect } = require('code');
const _ = require('lodash');


// TODO: Look into more elegant solution to clear/truncate all tables from db besides a hard coded array.
const pgTables = [
	'admins',
	'client_reviews',
	'clients',
	'education_history',
	'employment_history',
	'fields',
	'freelancer_reviews',
	'freelancer_skills',
	'freelancers',
	'inappropriate_flags',
	'invitations',
	'job_activity',
	'jobs',
	'proposals',
	'saved_clients',
	'saved_freelancers',
	'saved_jobs',
	'skills',
];


const helpers = {
	knex,
	random,
	_,

	db: {
		// clears all of the tables in the test db
		resetAll: () => {
			const queries = [];
			pgTables.forEach((table) => queries.push(knex.raw(`TRUNCATE ${table} CASCADE;`)));

			return Promise.all(queries);
		},
		// clears specific table in db
		resetTable: (table) => {
			return knex.raw(`TRUNCATE ${table} CASCADE;`);
		},
	},

	// The below object and methods are used to check the errors that the model methods return. Since the same errors are returned and checked by multiple models, I put them here to re-use them and improve DRYness
	checkErr: {
		// checks the actual error message to determine the cause, what it was attempting, etc. used by all below checkErr methods
		checkMessage: (err, table, action, field, result, cause) => {
			// ex: The client you are attempting to create couldn't be completed. You gave an id that wasn't in proper uuid format
			expect(err.message).to.include(table); // ex: client
			expect(err.message).to.include(action); //ex: create, find, delete
			expect(err.message).to.include(field);
			expect(err.message).to.include(result); // ex: 'couldn't be completed', 'does not exist'
			expect(err.message).to.include(cause); // ex: 'not found', 'violated the unique constraint'
		},


		// check that the given id is in uuid format
		checkIdFormat: async(Model, method, action, table, data = {}) => {
			/* Examples of parameters below
				Model: name of model, ex: Clients, Admins
				method: method being performed, ex: create, findOne
				action: same as method, but how it will be displayed in the error message, ex: findOne is shown as 'find' in the error message
				table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill
				data: the object data needed to perform the query
			*/
			try {
				if (method === 'update') {
					// in the event of update, where we have to pass in the id and data
					await Model.update(1, data);
				} else if (method === 'findOne') {
					// in the event of findOne, where we have to pass in just the id
					await Model.findOne(1);
				} else if (method === 'create'){
					// in the event of create, where we just pass in the data
					// await Model[`${method}`](data);
					await Model.create(data);
				}
			} catch (err) {
				return helpers.checkErr.checkMessage(err, table, action, 'id', 'couldn\'t be completed', 'proper uuid format');
			}
		},


		// check that certain fields are required upon create
		checkNotNull: async(Model, table, data, field) => {
			const createData = _.omit(data, field);

			try {
				await Model.create(createData);
			} catch (err) {
				return helpers.checkErr.checkMessage(err, table, 'create', field, 'couldn\'t be completed', 'violated the not-null constraint');
			}
		},

	},


};


module.exports = helpers;
