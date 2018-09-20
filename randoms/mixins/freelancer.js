'use strict';


// This file is used to create a random freelancer record for testing. If given no parameters, randomizes all fields
const random = new (require('chance'));
const Freelancers = require(`${process.cwd()}/src/services/users/models/freelancers`);
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);


module.exports = async(opts = {}) => {
	let password;

	// When going through the freelancers mixin to create multiple freelancer records (ex: 50), we don't hash every password, far too time consuming. So if the 'dontHash' variable in opts is true, it's telling this mixin to not hash it. We instead hash it in the freelancers mixin and pass it to this mixin. if 'dontHash' is false, then we hash either the given plain password or a random word like normal below
	if (opts.dontHash) {
		password = opts.password;
	} else {
		const beforeHash = opts.password || random.word();
		password = hashPassword(beforeHash);
	}
	// if the needed foreign keys aren't given, we create them here
	if (!opts.field_id) {
		opts.field_id = random.guid();
		await random.field({ id: opts.field_id });
	}


	return Freelancers.createWithoutHash({
		id: opts.id || random.guid(),
		first_name: opts.first_name || random.name(),
		last_name: opts.last_name || random.name(),
		username: opts.username || `${random.guid().substring(0, 16)}-freelancerUserName`,
		email: opts.email || `${random.guid().substring(0, 16)}@freelancer.com`,
		job_title: opts.job_title || random.word(),
		rate: opts.rate || 20,
		experience_level: opts.experience_level || 'intermediate',
		video_url: opts.video_url || null,
		portfolio_url: opts.portfolio_url || null,
		available: opts.available || 'true',
		gender: opts.gender || 'male',
		age: opts.age || 20,
		field_id: opts.field_id,
		summary: opts.summary || random.paragraph(),
		state: opts.state || 'TX',
		city: opts.city || random.word(),
		zip: opts.zip || random.zip(),
		phone: opts.phone || random.phone(),
		dob: opts.dob || random.date({ string: true }),
		password,
	});
};
