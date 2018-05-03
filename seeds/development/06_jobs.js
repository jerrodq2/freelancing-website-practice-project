'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const fieldIds = require(`${process.cwd()}/seeds/ids/fields`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const Jobs = require(`${process.cwd()}/src/models/jobs`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('jobs').del();
	// Inserts seed entries
	return Promise.all([
		Jobs.create({
			id: jobIds.wordpress,
			title: 'Wordpress Developer Needed!',
			rate: 35,
			description: 'An expert level wordpress developer is needed!',
			experience_level_requested: 'expert',
			field_id: fieldIds.front_end,
			client_id: clientIds.sherlock,
			freelancer_id: freelancerIds.naruto,
			open: false
		}),

		Jobs.create({
			id: jobIds.batwing,
			title: 'Need help with the batwing',
			rate: 10000,
			rate_type: 'flat',
			description: 'Alfred is on vacation, batwing is giving me issues....',
			city: 'gotham',
			onsite_required: true,
			experience_level_requested: 'expert',
			field_id: fieldIds.full_stack,
			client_id: clientIds.bruce
		}),

		Jobs.create({
			id: jobIds.basic_website,
			title: 'Need a basic website to market my services',
			rate: 20,
			description: 'Just want to get my name out there',
			experience_level_requested: 'intermediate',
			field_id: fieldIds.front_end,
			client_id: clientIds.jack,
			city: 'Dallas',
			state: 'TX'
		})
	]);
};
