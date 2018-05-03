'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const Proposals = require(`${process.cwd()}/src/models/proposals`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('proposals').del();
	// Inserts seed entries
	return Promise.all([
		Proposals.create({
			title: 'I can do it dattebayo',
			description: 'I can do it easily',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
			job_id: jobIds.wordpress
		}),

		Proposals.create({
			title: 'I can deal with it',
			description: 'Let me help you',
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.bruce,
			job_id: jobIds.batwing
		}),

		Proposals.create({
			title: 'I can solve your problem',
			description: 'I am a master at front end',
			freelancer_id: freelancerIds.ryan,
			client_id: clientIds.jack,
			job_id: jobIds.basic_website
		}),

		Proposals.create({
			title: 'I can do it better than ryan',
			description: 'Always do',
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.jack,
			job_id: jobIds.basic_website
		})
	]);
};
