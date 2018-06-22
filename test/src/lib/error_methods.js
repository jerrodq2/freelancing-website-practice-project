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
		console.log(err.message);
		expect(err.message).to.be.a.string();
		expect(err.message).to.include(table);
		expect(err.message).to.include(action);
		expect(err.message).to.include(field);
		expect(err.message).to.include(result);
		expect(err.message).to.include(cause);
	},


	// check that the given id is in uuid format, used in most methods
	checkIdFormat: async(Model, table, action, data = {}) => {
		/* Examples of parameters below
	    Model: name of model, ex: Clients, Admins

			table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill

			action:  method being performed, but how it will be displayed in the error message, ex: findOne is shown as 'find' in the error message while 'create' is still create

	    data: the object data needed to perform the query
	  */
		try {
			if (action === 'update') {
				// in the event of update, where we have to pass in the id and data
				await Model.update(1, data);
			} else if (action === 'find') {
				// in the event of findOne, where we have to pass in just the id
				await Model.findOne(1);
			} else if (action === 'create'){
				// in the event of create, where we just pass in the data
				await Model.create(data);
			} else if (action === 'delete'){
				// in the event of delete, where we have to pass in just the id
				await Model.delete(1);
			} else if (action === 'find history for'){
				// in the event of findHistory, where we have to pass in just the id
				await Model.findHistory(1);
			} else {
				throw new Error('You need to give one of the above actions');
			}
		} catch (err) {
			return checkErr.checkMessage(err, table, action, 'id', 'couldn\'t be completed', 'proper uuid format');
		}
	},

	// check that giving an incorrect id (or one that doesn't belong to a record in the db) raises an error. Used for findOne, update, and delete mainly
	checkNotFound: async(Model, table, action, id, data = {}) => {
		/* Examples of parameters below
	    Model: name of model, ex: Clients, Admins

			table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill

			action:  method being performed, but how it will be displayed in the error message, ex: findOne is shown as 'find' in the error message while 'create' is still create

			id: the random id given, I make it a given parameter instead of creating a random id here for simplicity

	    data: the object data needed to perform the update query
	  */
		try {
			if (action === 'update') {
				// in the event of update, where we have to pass in the id and data
				await Model.update(id, data);
			} else if (action === 'find') {
				// in the event of findOne, where we have to pass in just the id
				await Model.findOne(id);
			} else if (action === 'delete'){
				// in the event of delete, where we have to pass in just the id
				await Model.delete(id);
			} else {
				throw new Error('You need to give one of the above actions');
			}
		} catch (err) {
			return checkErr.checkMessage(err, table, action, 'id', 'does not exist', 'not found');
		}
	},


	// check that certain fields are required upon create, used only for create
	checkNotNull: async(Model, table, data, field) => {
		/* Examples of parameters below
	    Model: name of model, ex: Clients, Admins

			table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill

			data: the object data needed to perform the query

	    field: specific field that caused the error, ex: id, email, client_id
	  */
		// first we remove the field to check that it is a nonNullable field
		const createData = _.omit(data, field);
		try {
			await Model.create(createData);
		} catch (err) {
			return checkErr.checkMessage(err, table, 'create', field, 'couldn\'t be completed', 'violated the not-null constraint');
		}
	},


	//checks that certain fields must be unique in order to create, ex: no duplicate emails, used only for create
	checkUnique: async(Model, table, action, data, field, duplicateValue, updateId = null) => {
		/* Examples of parameters below
	    Model: name of model, ex: Clients, Admins

			table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill

			action: method being performed as it will be shown in the error message, only create or update

			data: the object data needed to perform the query

	    field: specific field that caused the error, ex: id, email, client_id

			duplicateValue: the duplicateValue we make the field in the data equal to, ex: an email already in use by a client

			updateId: a given id used in the update method, null by default so it doesn't have to be provided when checking the create method
		*/
		// first we ensure that the given field has a duplicate value
		data[`${field}`] = duplicateValue;
		try {
			if (action === 'create') {
				await Model.create(data);
			} else if (action === 'update') {
				await Model.update(updateId, data);
			} else {
				throw new Error('You need to provide an action of create or update');
			}
		} catch (err) {
			return checkErr.checkMessage(err, table, action, field, 'couldn\'t be completed', 'violated the unique constraint');
		}
	},


	//checks that foreign key fields require a correct id, or an id belonging to a record in the database, used only for create and update
	checkForeign: async(Model, table, action, data, field, randomId, updateId = null) => {
		/* Examples of parameters below
	    Model: name of model, ex: Clients, Admins

			table: name of table as it will be shown in the error message, basically the models singular, ex: client, job, skill

			action: method being performed as it will be shown in the error message, only create or update

			data: the object data needed to perform the query

	    field: specific field that caused the error, ex: id, email, client_id

			duplicateValue: random id we make the field equal to. I make the it a given parameter instead of importing random and creating it here for simplicity

			updateId: a given id used in the update method, null by default so it doesn't have to be provided when checking the create method
		*/
		// first we ensure that the given field has a random id
		data[`${field}`] = randomId;
		try {
			if (action === 'create') {
				await Model.create(data);
			} else if (action === 'update') {
				await Model.update(updateId, data);
			} else {
				throw new Error('You need to provide an action of create or update');
			}
		} catch (err) {
			return checkErr.checkMessage(err, table, action, field, 'couldn\'t be completed', 'violated the foreign key constraint');
		}
	},
};


module.exports = checkErr;
