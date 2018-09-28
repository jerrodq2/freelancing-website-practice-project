'use strict';


// This file creates error methods I can use throughout the project. Basically, by using Boom, the methods below give more specific error messages. Some of the methods determine the reason for the error, the rest send an appropriate error message
const Boom = require('boom');

// I use boom for http friendly error objects. This file creates some useful boom methods we can use throughout the project.
// The top methods check the given error message to narrow down the cause, then the bottom methods throw the appropriate message and error
module.exports = {
	Boom,

	// The below methods check to see what caused the error
	// checks if the id is in proper uuid format
	violatesIdSyntax: (err) => err.message.indexOf('invalid input syntax') >= 0,
	// checks if a not-null constraint was violated, ex: try to create a client without a field_id, which is a nonNullable field
	violatesNull: (err) => err.message.indexOf('violates not-null') >= 0,
	// checks to see if a foreign key constraint was violated, ex: create a job without a client_id
	violatesForeignKey: (err) => err.message.indexOf('violates foreign key constraint') >= 0,
	// checks to see if a unique constraint was violated, ex: try to create two skills with both having the skill of 'html'
	violatesUnique: (err) => err.message.indexOf('violates unique constraint') >= 0,


	// The rest of the methods below send a more specific error message once the reason has been determined.
	// returns a bad id format message with the table and action as injected parameters
	badId: (table, action, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You gave an id that wasn't in proper uuid format`;

		return Boom.badRequest(message, data);
	},


	// returns a violated not-null constraint message with the table, action, and column that violated the constraint as injected parameters
	badNull: (table, action, column, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You violated the not-null constraint in the '${column}' column`;

		return Boom.badRequest(message, data);
	},


	// returns a violated foreign key constraint message with the table, action, and column that violated the constraint as injected parameters
	badForeignKey: (table, action, column, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You violated the foreign key constraint in the '${column}' column`;

		return Boom.badRequest(message, data);
	},


	// returns a violated unique constraint message with the table, action, and column that violated the constraint as injected parameters
	badUnique: (table, action, column, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You violated the unique constraint in the '${column}' column`;

		return Boom.badRequest(message, data);
	},


	// returns a not found message with the table, action and column that wasn't found as injected parameters
	notFound: (table, action, searchedColumn = 'id', data = {}) => {
		const message = `The ${table} you are attempting to ${action} does not exist, the record with that ${searchedColumn} was not found.`;

		return Boom.notFound(message, data);
	},

};


// Boom.conflict('there was a conflict');
