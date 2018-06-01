'use strict';


const { expect } = require('code');
const _ = require('lodash');


// This file contaains the methods that are used in the unit tests to test error messages/handling, it was abstracted out of the helpers.js file due to its bulkiness. The Models return the same error messages, so they were abstracted to here for DRYness, each method below has comments to explain the parameters and give examples.
const checkErr = {

	// checks the actual error message to determine the cause, what it was attempting, etc. used by all below checkErr methods
	checkMessage: (err, table, action, field, result, cause) => {
		/* Examples of parameters below
		Example of error: The client you are attempting to create couldn't be completed. You gave an id that wasn't in proper uuid format

			err: the error message

			table: the table as it is shown in the error message (singular), ex: 	client, job, skill

			action: method being performed as it will be shown in the error message, ex: create, or find for the findOne method

			field: specific field that caused the error, ex: id, email, client_id

			result: the outcome of the error, ex: couldn't be completed, does not exist

			cause: the specific reason that caused the error, ex: not found, violated the not-null constraint
		*/
		expect(err.message).to.include(table);
		expect(err.message).to.include(action);
		expect(err.message).to.include(field);
		expect(err.message).to.include(result);
		expect(err.message).to.include(cause);
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
				await Model.create(data);
			}
		} catch (err) {
			return checkErr.checkMessage(err, table, action, 'id', 'couldn\'t be completed', 'proper uuid format');
		}
	},


	// check that certain fields are required upon create
	checkNotNull: async(Model, table, data, field) => {
		/* Examples of parameters below
	    Model: name of model, ex: Clients, Admins

			table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill

			data: the object data needed to perform the query

	    field: specific field that caused the error, ex: id, email, client_id
	  */
		const createData = _.omit(data, field);
		try {
			await Model.create(createData);
		} catch (err) {
			return checkErr.checkMessage(err, table, 'create', field, 'couldn\'t be completed', 'violated the not-null constraint');
		}
	},


	//checks that foreign key fields require a correct id, or an id belonging to a record in the database, to create
	checkForeign: async() => {
		
	},

};


module.exports = checkErr;
