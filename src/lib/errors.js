'use strict';


const Boom = require('boom');

// I use boom for http friendly error objects. This file creates some useful boom methods we can use throughout the project.
// The top methods check the given error message to narrow down the cause, then the bottom methods throw the appropriate message and error
module.exports = {
	Boom,

	// checks if a not-null constraint was violated, ex: try to create a client without a field_id, which is a nonNullable field
	violatesNull: (err) => err.message.indexOf('violates not-null') >= 0,

	// checks if the id is in proper uuid format
	violatesIdSyntax: (err) => err.message.indexOf('invalid input syntax') >= 0,

	// checks to see if a foreign key constraint was violated, ex: create a job without a client_id
	violatesForeignKey: (err) => err.message.indexOf('violates foreign key constraint') >= 0,

	// checks to see if a unique constraint was violated, ex: try to create two skills with both having the skill of 'html'
	violatesUnique: (err) => err.message.indexOf('duplicate key value violates unique constraint') >= 0,


	notFound: (table, action, data = {}) => {
		const message = `The ${table} you are attempting to ${action} does not exist, the record with that id was not found.`;

		return Boom.notFound(message, data);
	},


	badNull: (table, action, column, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You violated the not-null constraint in the '${column}' column`;

		return Boom.badRequest(message, data);
	},


	badId: (table, action, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You gave an id that wasn't in proper uuid format`;

		return Boom.badRequest(message, data);
	},


	badForeignKey: (table, action, column, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You violated the foreign key constraint in the '${column}' column`;

		return Boom.badRequest(message, data);
	},


	badUnique: (table, action, column, data = {}) => {
		const message = `The ${table} you are attempting to ${action} couldn't be completed. You violated the unique constraint in the '${column}' column`;

		return Boom.badRequest(message, data);
	},

};


// Boom.conflict('there was a conflict');
