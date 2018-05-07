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
			id: jobIds.basic_website,
			title: 'Need a basic website to market my services',
			rate: 20,
			description: 'Just want to get my name out there',
			experience_level_requested: 'intermediate',
			field_id: fieldIds.front_end,
			client_id: clientIds.jack,
			city: 'Dallas',
			state: 'TX'
		}),

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
			client_id: clientIds.bruce,
			freelancer_id: freelancerIds.dick,
			open: false,
		}),

		Jobs.create({
			id: jobIds.personal_website,
			title: 'Wordpress developer needed',
			rate: 30,
			description: 'Need help setting up a simple front end website',
			city: 'gotham',
			state: 'NY',
			experience_level_requested: 'any',
			field_id: fieldIds.front_end,
			client_id: clientIds.bruce,
			freelancer_id: freelancerIds.naruto,
			open: false,
		}),

		Jobs.create({
			id: jobIds.ecommerce_site,
			title: 'Want to set up marketing site',
			rate: 35,
			description: 'Want to setup an ecommerce site, need expert help',
			city: 'gotham',
			state: 'NY',
			experience_level_requested: 'expert',
			field_id: fieldIds.ecommerce,
			client_id: clientIds.bruce,
		}),

		Jobs.create({
			id: jobIds.mobile_app,
			title: 'Need mobile app',
			rate: 40,
			description: 'Trying to get a mobile app up and running, no clue where to start',
			city: 'gotham',
			experience_level_requested: 'expert',
			field_id: fieldIds.mobile_app,
			client_id: clientIds.steve
		}),

		Jobs.create({
			id: jobIds.teaching,
			title: 'Want someone to teach me how to work with wordrpess',
			rate: 40,
			description: 'Want to setup up wordpress site. Most likely will be the first of many, hence I want someone to make it and show the ropes',
			experience_level_requested: 'expert',
			field_id: fieldIds.other,
			client_id: clientIds.steve
		}),

		Jobs.create({
			id: jobIds.hs_website,
			title: 'Revamp high school website',
			rate: 20,
			description: 'Volunteered to revamp the local high school website, could use some help',
			experience_level_requested: 'any',
			field_id: fieldIds.full_stack,
			client_id: clientIds.peter
		}),

		Jobs.create({
			id: jobIds.ecommerce_repaire_site,
			title: 'Setting up ecommerce site to repari things',
			rate: 15,
			description: 'I want to setup an ecommerce site so I can sell small gizmos',
			experience_level_requested: 'any',
			field_id: fieldIds.ecommerce,
			client_id: clientIds.peter,
			freelancer_id: clientIds.izuku,
			open: false,
		}),

		Jobs.create({
			id: jobIds.software_project,
			title: 'Need support for software engineering project',
			rate: 45,
			description: 'Creating a new piece of software, could use a partner, contact me for more details',
			state: 'NY',
			experience_level_requested: 'expert',
			field_id: fieldIds.software,
			client_id: clientIds.tony
		}),

		Jobs.create({
			id: jobIds.front_end_site,
			title: 'Need help with front end',
			rate: 700,
			rate_type: 'flat',
			description: 'Creating a new website, I can handle the back end, need someone to take care of the front end',
			city: 'NY',
			experience_level_requested: 'any',
			field_id: fieldIds.front_end,
			client_id: clientIds.banner
		}),

		Jobs.create({
			id: jobIds.front_end_app,
			title: 'Need help with front end',
			rate: 500,
			rate_type: 'flat',
			description: 'Need help to create the front end of an app i\'m building',
			city: 'NY',
			experience_level_requested: 'any',
			field_id: fieldIds.front_end,
			client_id: clientIds.banner
		}),

		Jobs.create({
			id: jobIds.testing_app,
			title: 'Need help testing new app',
			rate: 25,
			description: 'Created a new app, could use help testing it out',
			experience_level_requested: 'any',
			field_id: fieldIds.qa,
			client_id: clientIds.natasha
		}),

		Jobs.create({
			id: jobIds.wordpress_site,
			title: 'Need someone knowledgeable in wordpress',
			rate: 36,
			description: 'Need to setup a wordpress site, not familiar with it myself',
			experience_level_requested: 'any',
			field_id: fieldIds.front_end,
			client_id: clientIds.natasha,
			freelancer_id: clientIds.jerrod,
			open: false
		}),

		Jobs.create({
			id: jobIds.database_for_app,
			title: 'Need database for new app',
			rate: 40,
			description: 'Need to setup complicated database for new app',
			experience_level_requested: 'expert',
			field_id: fieldIds.database,
			client_id: clientIds.natasha,
		}),


	]);
};
