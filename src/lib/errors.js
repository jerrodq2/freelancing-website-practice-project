'use strict';


const Boom = require('boom');

// We use boom for http friendly error objects. This file creates some useful boom methods we can use throughout the project.
module.exports = {
	Boom,

	// checks if a query violates a not-null constrain, ex: try to create a client without a field_id, which is a nonNullable field
	violatesNull: (err) => err.message.indexOf('violates not-null') >= 0,

	badRequest: (table, action, field, data = {}) => {
		const message = `The ${table} you were attempting to ${action} couldn't be completed. You violated the not-null constrain in the '${field}' column`;

		return Boom.badRequest(message, data);
	},

};


// Boom.conflict('there was a conflict');
