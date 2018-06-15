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
		// When creating several clients (ex: 50), we want to skip hashing the password 50 times in the client mixin or model, which is by far the most time consuming part of it. So we hash one password and give all 50 clients that same password, speeds up the 50 inserts by roughly 9 times. Or, we can pass in 'dontHash' = false, to make it hash the given plain password or hash a random word in the mixin like normal. We tell the client mixin not to hash via the 'dontHash' variable below
		if (dontHash) {
			opts.password = hashPassword('password');
			opts.dontHash = true;
		}

		const clients = _.times(count, () => random.client(opts));
		return Promise.all(clients);
	},


	education_histories: async(count = 10, opts = {}) => {
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id });
		}

		const education_history = _.times(count, () => random.education_history(opts));
		return Promise.all(education_history);
	},


	employment_histories: async(count = 10, opts = {}) => {
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id });
		}

		const employment_history = _.times(count, () => random.employment_history(opts));
		return Promise.all(employment_history);
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


	freelancer_reviews: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// create a client if not given
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		// create a freelancer if not given
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		const reviews = _.times(count, () => {
			opts = _.omit(opts, 'job_id'); // needs a unique job_id for every record
			return random.freelancer_review(opts);
		});
		return Promise.all(reviews);
	},


	jobs: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// create a client if not given
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		// create a freelancer if not given
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		const jobs = _.times(count, () => random.job(opts));
		return Promise.all(jobs);
	},


	skills: (count = 10, opts = {}) => {
		const skills = _.times(count, () => random.skill(opts));
		return Promise.all(skills);
	},


});


module.exports = random;
