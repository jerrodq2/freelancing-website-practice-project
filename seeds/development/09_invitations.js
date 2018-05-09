'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const Invitations = require(`${process.cwd()}/src/models/invitations`);

const today = new Date();
// Create a date 2 weeks from now
const futureDateOne = new Date();
futureDateOne.setDate(today.getDate()+14);
// Create a date 10 days from now
const futureDateTwo = new Date();
futureDateTwo.setDate(today.getDate()+10);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('proposals').del();
	// Inserts seed entries
	return Promise.all([
		Invitations.create({
			title: 'Desperately need a wordpress developer',
			description: 'Need some help, can you do it?',
			status: 'accepted',
			requested_time_limit: futureDateOne,
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
			job_id: jobIds.personal_website
		}),

	]);
};
