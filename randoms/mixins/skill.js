'use strict';


const random = new (require('chance'));
const Skills = require(`${process.cwd()}/src/models/skills`);

// used to create a random skill. If given no parameters, randomizes all fields.
module.exports = (opts = {}) => Skills.create({
	id: opts.id || random.guid(),
	skill: opts.skill || random.word(),
});
