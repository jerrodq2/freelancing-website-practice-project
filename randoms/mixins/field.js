'use strict';


const random = new (require('chance'));
const Fields = require(`${process.cwd()}/src/models/fields`);

// used to create a random field. If given no parameters, randomizes all fields.
module.exports = (opts = {}) => Fields.create({
	id: opts.id || random.guid(),
	field: opts.field || random.word(),
});
