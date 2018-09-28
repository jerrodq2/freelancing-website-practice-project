'use strict';


// This file is used to create a random field record for testing. If given no parameters, randomizes all fields.
const random = new (require('chance'));
const Fields = require(`${process.cwd()}/src/services/fields/models/fields`);


module.exports = (opts = {}) => Fields.create({
	id: opts.id || random.guid(),
	field: opts.field || `field name-${random.guid().substring(0, 16)}`,
});
