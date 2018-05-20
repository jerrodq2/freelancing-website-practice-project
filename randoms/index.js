'use strict';


const random = new (require('chance'));
const _ = require('lodash');

// Loads all of the mixins we created and adds them to random/chance, this has to happen first
random.mixin(require('./mixins'));

// methods that create multiple records, ex: 10 clients, 20 skills, etc.
random.mixin({
	fields: (count = 10, opts = {}) => {
		const fields = _.times(count, () => random.field(opts));
		return Promise.all(fields);
	},

	skills: (count = 10, opts = {}) => {
		const skills = _.times(count, () => random.skill(opts));
		return Promise.all(skills);
	},


});


module.exports = random;
