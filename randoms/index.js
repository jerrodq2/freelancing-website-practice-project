'use strict';


const random = new (require('chance'));
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');

// Loads all of the mixins we created and adds them to random/chance, this has to happen first
random.mixin(require('./mixins'));

// methods that create multiple records, ex: 10 clients, 20 skills, etc.
random.mixin({

	clients: async(count = 10, opts = {}, dontHash = true) => {
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// When creating several clients (ex: 50), we want to skip hashing the password 50 times in the client mixin or model, which is by far the most time consuming part of it. So we hash one password and give all 50 clients that same password, speeds up the 50 inserts by roughtly 9 times. Or, we can pass in 'dontHash' = false, to make it hash the given plain password or hash a random word in the mixin like normal. We tell the client mixin not to hash via the 'dontHash' variable below
		if (dontHash) {
			opts.password = hashPassword('password');
			opts.dontHash = true;
		}

		const clients = _.times(count, () => random.client(opts));
		return Promise.all(clients);
	},


	fields: (count = 10, opts = {}) => {
		const fields = _.times(count, () => random.field(opts));
		return Promise.all(fields);
	},


	freelancers: async(count = 10, opts = {}, dontHash = true) => {
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// see above explanation in the clients mixin as to why this step is here.
		if (dontHash) {
			opts.password = hashPassword('password');
			opts.dontHash = true;
		}

		const freelancers = _.times(count, () => random.freelancer(opts));
		return Promise.all(freelancers);
	},


	skills: (count = 10, opts = {}) => {
		const skills = _.times(count, () => random.skill(opts));
		return Promise.all(skills);
	},


});


module.exports = random;
