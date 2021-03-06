'use strict';


// This file loads all of the random mixins we created in the mixins folder and adds them to the random/chance npm module. This allows us to add customized mixins to quickly create db records for testing. This file also creates mixins that allow for than one random record to be created at a time.
const random = new (require('chance'));
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);
const _ = require('lodash');


// this has to happen first
random.mixin(require('./mixins'));


// methods that create multiple records, ex: 10 clients, 20 skills, etc.
random.mixin({
	client_reviews: async(count = 10, opts = {}) => {
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
			return random.client_review(opts);
		});
		return Promise.all(reviews);
	},


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


	flagged_client_reviews: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}
		// if not given either of these keys, we set the flag to be created by a freelancer by default
		if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
			opts.freelancer_who_flagged = random.guid();
			await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
		}

		const flagged_client_reviews = _.times(count, () => {
			opts = _.omit(opts, 'client_review_id'); // needs a unique client_review for every record
			return random.flagged_client_review(opts);
		});
		return Promise.all(flagged_client_reviews);
	},


	flagged_clients: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// if not given either of these keys, we set the flag to be created by a freelancer by default
		if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
			opts.freelancer_who_flagged = random.guid();
			await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
		}

		const flagged_clients = _.times(count, () => {
			opts = _.omit(opts, 'client_id'); // needs a unique client for every record
			return random.flagged_client(opts);
		});
		return Promise.all(flagged_clients);
	},


	flagged_freelancer_reviews: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}
		// if not given either of these keys, we set the flag to be created by a freelancer by default
		if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
			opts.freelancer_who_flagged = random.guid();
			await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
		}

		const flagged_freelancer_reviews = _.times(count, () => {
			opts = _.omit(opts, 'freelancer_review_id'); // needs a unique freelancer_review for every record
			return random.flagged_freelancer_review(opts);
		});
		return Promise.all(flagged_freelancer_reviews);
	},


	flagged_freelancers: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// if not given either of these keys, we set the flag to be created by a client by default
		if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
			opts.client_who_flagged = random.guid();
			await random.client({ id: opts.client_who_flagged, field_id: opts.field_id });
		}

		const flagged_freelancers = _.times(count, () => {
			opts = _.omit(opts, 'freelancer_id'); // needs a unique freelancer for every record
			return random.flagged_freelancer(opts);
		});
		return Promise.all(flagged_freelancers);
	},


	flagged_invitations: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// we create the client and freelancer here if not given, this saves us the trouble of creating a new client/freelancer for every invitation
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		// if the needed freelancer_who_flagged isn't given, we create it here. This flag can only be created by a freelancer
		if (!opts.freelancer_who_flagged) {
			opts.freelancer_who_flagged = random.guid();
			await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
		}

		const flagged_invitations = _.times(count, () => {
			opts = _.omit(opts, 'invitation_id'); // needs a unique invitation and job for every record
			return random.flagged_invitation(opts);
		});
		return Promise.all(flagged_invitations);
	},


	flagged_jobs: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// by creating the client here, we prevent a new client from having to be creted for every job
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		// if not given either of these keys, we set the flag to be created by a freelancer by default
		if (!opts.client_who_flagged && !opts.freelancer_who_flagged) {
			opts.freelancer_who_flagged = random.guid();
			await random.freelancer({ id: opts.freelancer_who_flagged, field_id: opts.field_id });
		}

		const flagged_jobs = _.times(count, () => {
			opts = _.omit(opts, 'job_id'); // needs a unique job for every record
			return random.flagged_job(opts);
		});
		return Promise.all(flagged_jobs);
	},


	flagged_proposals: async(count = 10, opts = {}) => {
		// create a field if not given
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// we create the client and freelancer here if not given, this saves us the trouble of creating a new client/freelancer for every proposal
		if (!opts.client_id) {
			opts.client_id = random.guid();
			await random.client({ id: opts.client_id, field_id: opts.field_id });
		}
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		// if the needed client_who_flagged isn't given, we create it here. This flag can only be created by a client
		if (!opts.client_who_flagged) {
			opts.client_who_flagged = random.guid();
			await random.client({ id: opts.client_who_flagged, field_id: opts.field_id });
		}

		const flagged_proposals = _.times(count, () => {
			opts = _.omit(opts, 'proposal_id'); // needs a unique proposal and job for every record
			return random.flagged_proposal(opts);
		});
		return Promise.all(flagged_proposals);
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


	freelancer_skills: async(count = 10, opts = {}) => {
		// create a freelancer if not given
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		const freelancer_skills = _.times(count, () => {
			opts = _.omit(opts, 'skill'); // needs a unique skill for every record
			return random.freelancer_skill(opts);
		});
		return Promise.all(freelancer_skills);
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


	invitations: async(count = 10, opts = {}) => {
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

		const invitations = _.times(count, () => {
			opts = _.omit(opts, 'job_id'); // needs a new job for every record, it is created in the invitation mixin for each record
			return random.invitation(opts);
		});
		return Promise.all(invitations);
	},


	job_activities: async(count = 10, opts = {}) => {
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

		const job_activities = _.times(count, () => {
			opts = _.omit(opts, 'job_id'); // needs a new job for every record, it is created in the job_activity mixin for each record
			return random.job_activity(opts);
		});
		return Promise.all(job_activities);
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


	proposals: async(count = 10, opts = {}) => {
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

		const proposals = _.times(count, () => {
			opts = _.omit(opts, 'job_id'); // needs a new job for every record, it is created in the proposal mixin for each record
			return random.proposal(opts);
		});
		return Promise.all(proposals);
	},


	saved_clients: async(count = 10, opts = {}) => {
		// create a field if not given, just prevents a field having to be created more than once
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// create a freelancer if not given
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		const saved_clients = _.times(count, () => {
			opts = _.omit(opts, 'client_id'); // needs a new client for every record, it is created in the saved_client mixin for each record
			return random.saved_client(opts);
		});
		return Promise.all(saved_clients);
	},


	saved_freelancers: async(count = 10, opts = {}) => {
		// create a field if not given, just prevents a field having to be created more than once
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// create a freelancer if not given
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		const saved_freelancers = _.times(count, () => {
			opts = _.omit(opts, 'client_id'); // needs a new client for every record, it is created in the saved_freelancer mixin for each record
			return random.saved_freelancer(opts);
		});
		return Promise.all(saved_freelancers);
	},


	saved_jobs: async(count = 10, opts = {}) => {
		// create a field if not given, just prevents a field having to be created more than once
		if (!opts.field_id) {
			opts.field_id = random.guid();
			await random.field({ id: opts.field_id });
		}
		// create a freelancer if not given
		if (!opts.freelancer_id) {
			opts.freelancer_id = random.guid();
			await random.freelancer({ id: opts.freelancer_id, field_id: opts.field_id });
		}

		const saved_jobs = _.times(count, () => {
			opts = _.omit(opts, 'job_id'); // needs a new job for every record, it is created in the saved_job mixin for each record
			return random.saved_job(opts);
		});
		return Promise.all(saved_jobs);
	},


	skills: (count = 10, opts = {}) => {
		const skills = _.times(count, () => random.skill(opts));
		return Promise.all(skills);
	},


});


module.exports = random;
