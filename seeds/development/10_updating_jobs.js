'use strict';


// This file updates the already inserted jobs so some are closed. This is done after the invitations and proposal seeds are created to avoid errors
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const Jobs = require(`${process.cwd()}/src/services/jobs/models/jobs`);

exports.seed = async () => {
	const updateData = {
		available: false,
		closed: true,
	};
	// This file is to update several jobs to be closed. This has to be done after creating the invitations and proposals or they would error out, can't create them if the job is already closed.
	return Promise.all([
		Jobs.update(jobIds.wordpress, updateData),

		Jobs.update(jobIds.batwing, updateData),

		Jobs.update(jobIds.personal_website, updateData),

		Jobs.update(jobIds.ecommerce_repair_site, updateData),

		Jobs.update(jobIds.wordpress_site, updateData),

		Jobs.update(jobIds.full_stack_site, updateData),
	]);
};
