'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const otherIds = require(`${process.cwd()}/seeds/ids/misc`);
const Invitations = require(`${process.cwd()}/src/models/invitations`);

const today = new Date();
// Create a date 2 weeks from now
const futureDateOne = new Date();
futureDateOne.setDate(today.getDate()+14);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('invitations').del();
	// Inserts seed entries
	return Promise.all([
		Invitations.create({
			title: 'Basic website needed',
			description: 'Saw you were an experienced freelancer, I need help with a website to market my business.',
			status: 'pending',
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.jack,
			job_id: jobIds.basic_website
		}),

		Invitations.create({
			title: 'Desperately need a wordpress developer',
			description: 'Need some help, can you do it?',
			status: 'accepted',
			requested_time_limit: futureDateOne,
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
			job_id: jobIds.personal_website
		}),

		Invitations.create({
			title: 'Saw you had some experience',
			description: 'Need an ecommerce site where I can sell repaired items, saw you\'ve done similar projects in the past.',
			status: 'accepted',
			freelancer_id: freelancerIds.izuku,
			client_id: clientIds.peter,
			job_id: jobIds.ecommerce_repair_site
		}),

		Invitations.create({
			title: 'Need someone to show me the ropes',
			description: 'Can you help?',
			status: 'pending',
			freelancer_id: freelancerIds.leon,
			client_id: clientIds.steve,
			job_id: jobIds.teaching
		}),

		Invitations.create({
			title: 'Need someone to show me the ropes',
			description: 'Can you help?',
			status: 'rejected',
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.steve,
			job_id: jobIds.teaching
		}),

		Invitations.create({
			id: otherIds.loki_invitation,
			title: 'Need great website!',
			description: 'Can you help?',
			status: 'pending',
			freelancer_id: freelancerIds.leon,
			client_id: clientIds.loki,
			job_id: jobIds.bad_database
		}),

	]);
};
