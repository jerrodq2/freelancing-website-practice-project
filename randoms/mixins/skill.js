'use strict';


// This file is used to create a random skill record for testing. If given no parameters, randomizes all fields.
const random = new (require('chance'));
const Skills = require(`${process.cwd()}/src/services/skills/models/skills`);


module.exports = (opts = {}) => Skills.create({
	id: opts.id || random.guid(),
	skill: opts.skill || `skill name-${random.guid().substring(0, 16)}`,
});
