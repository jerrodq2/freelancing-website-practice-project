'use strict';


const random = new (require('chance'));
const Skills = require(`${process.cwd()}/src/services/skills/models/skills`);

// used to create a random skill. If given no parameters, randomizes all fields.
module.exports = (opts = {}) => Skills.create({
	id: opts.id || random.guid(),
	skill: opts.skill || `skill name-${random.guid().substring(0, 16)}`,
});
