'use strict';


const Boom = require('boom');

// We use boom for http friendly error objects. This file creates some useful boom methods we can use throughout the project.
module.exports = {
	Boom,

	// checks if a query violates a not-null constrain, ex: try to create a client without a field_id, which is a nonNullable field
	violatesNull: (err) => err.message.indexOf('violates not-null') >= 0,

	// checks if the id is in proper uuid format
	violatesIdSyntax: (err) => err.message.indexOf('invalid input syntax') >= 0,

	// checks to see if a foreign key constrain was violated, ex: create a job without a client_id
	violatesForeignKey: (err) => err.message.indexOf('violates foreign key constraint') >= 0,

	badNull: (table, action, field, data = {}) => {
		const message = `The ${table} you were attempting to ${action} couldn't be completed. You violated the not-null constrain in the '${field}' column`;

		return Boom.badRequest(message, data);
	},

	badForeignKey: (table, action, constraint, data = {}) => {
		const message = `The ${table} you were attempting to ${action} couldn't be completed. You violated the foreign key constraint in the '${constraint}' constraint`;

		return Boom.badRequest(message, data);
	},

	badId: (table, action, data = {}) => {
		const message = `The ${table} you were attempting to ${action} couldn't be completed. You gave an id that wasn't in proper uuid format`;

		return Boom.badRequest(message, data);
	},

};


// Boom.conflict('there was a conflict');
