'use strict';


const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const jobIds = require(`${process.cwd()}/seeds/ids/jobs`);
const Proposals = require(`${process.cwd()}/src/models/proposals`);

// A date two weeks from now
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
		Proposals.create({
			title: 'I can do it dattebayo',
			description: 'I can do it easily',
			status: 'accepted',
			estimated_time_limit: futureDateOne,
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.sherlock,
			job_id: jobIds.wordpress
		}),

		Proposals.create({
			title: 'I can deal with it',
			description: 'Let me help you',
			status: 'rejected',
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.bruce,
			job_id: jobIds.batwing
		}),

		Proposals.create({
			title: 'I\'ll do it',
			description: 'As always, I have to take care of things while Alfred is away',
			status: 'accepted',
			freelancer_id: freelancerIds.dick,
			client_id: clientIds.bruce,
			job_id: jobIds.batwing
		}),

		Proposals.create({
			title: 'I can solve your problem',
			description: 'I am a master at front end',
			status: 'pending',
			freelancer_id: freelancerIds.ryan,
			client_id: clientIds.jack,
			job_id: jobIds.basic_website
		}),

		Proposals.create({
			title: 'I can do it better than ryan',
			description: 'Always do',
			status: 'pending',
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.jack,
			job_id: jobIds.basic_website
		}),

		Proposals.create({
			title: 'I\'ve made several ecommerce sites before',
			description: '',
			status: 'pending',
			freelancer_id: freelancerIds.naruto,
			client_id: clientIds.bruce,
			job_id: jobIds.ecommerce_site
		}),

		Proposals.create({
			title: 'I\'m your man.',
			description: 'I\'ve made several wordpress sites before, I can show you the essentials',
			status: 'pending',
			freelancer_id: freelancerIds.ryan,
			client_id: clientIds.steve,
			job_id: jobIds.teaching
		}),

		Proposals.create({
			title: 'Experienced developer able to help',
			description: '',
			status: 'rejected',
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.steve,
			job_id: jobIds.teaching
		}),

		Proposals.create({
			title: 'I have experience both in wordpress and teaching',
			description: 'I was a teacher for several years, now an experienced developer',
			status: 'pending',
			estimated_time_limit: futureDateOne,
			freelancer_id: freelancerIds.leon,
			client_id: clientIds.steve,
			job_id: jobIds.teaching
		}),

		Proposals.create({
			title: 'I\'m an expert in wordpress',
			description: 'I can easily do this for you',
			status: 'accepted',
			estimated_time_limit: futureDateTwo,
			freelancer_id: freelancerIds.jerrod,
			client_id: clientIds.natasha,
			job_id: jobIds.wordpress_site
		}),

		Proposals.create({
			title: 'I can build you a great site!',
			description: 'I specialize in the database, and I have experience in full stack development.',
			status: 'accepted',
			estimated_time_limit: futureDateOne,
			freelancer_id: freelancerIds.jessica,
			client_id: clientIds.natasha,
			job_id: jobIds.full_stack_site
		}),
	]);
};
