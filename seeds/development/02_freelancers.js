'use strict';


const fieldIds = require(`${process.cwd()}/seeds/ids/fields`);
const freelancerIds = require(`${process.cwd()}/seeds/ids/freelancers`);
const Freelancers = require(`${process.cwd()}/src/models/freelancers`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('freelancers').del();
	// Inserts seed entries
	return Promise.all([
		Freelancers.create({
			id: freelancerIds.jerrod,
			first_name: 'Jerrod',
			last_name: 'Quintana',
			username: 'jquintana',
			email: 'j@quintana.com',
			password: 'password',
			job_title: 'Full Stack Web Developer',
			rate: 45,
			gender: 'male',
			age: 25,
			field_id: fieldIds.full_stack,
			summary: 'full stack web developer proficient with Node.js, Ruby on Rails, .Net, React, Angular, and Wordpress',
			state: 'TX',
			city: 'Dallas',
			experience_level: 'expert'
		}),

		Freelancers.create({
			id: freelancerIds.ryan,
			first_name: 'Ryan',
			last_name: 'Quintana',
			username: 'rquintana',
			email: 'ryan@quintana.com',
			password: 'password',
			job_title: 'Front End Web Developer',
			rate: 33,
			gender: 'male',
			age: 25,
			field_id: fieldIds.front_end,
			summary: '7 years of experience building breathtaking front end websites',
			state: 'TX',
			city: 'Dallas',
			experience_level: 'intermediate'
		}),

		Freelancers.create({
			id: freelancerIds.jessica,
			first_name: 'Jessica',
			last_name: 'Jones',
			username: 'jjones',
			email: 'jesssica@jones.com',
			password: 'password',
			job_title: 'database',
			rate: 20,
			age: 29,
			gender: 'female',
			field_id: fieldIds.database,
			state: 'TX',
			city: 'Austin',
			experience_level: 'entry'
		}),

		Freelancers.create({
			id: freelancerIds.naruto,
			first_name: 'Naruto',
			last_name: 'Uzumaki',
			username: 'nuzumaki',
			email: 'naruto@uzumaki.com',
			password: 'password',
			job_title: 'Wordpress Developer',
			rate: 30,
			gender: 'male',
			age: 32,
			field_id: fieldIds.front_end,
			summary: 'I specialize in all things Wordpress, taijutsu, ninjutsu, talk no jutsu, etc.',
			state: 'TX',
			city: 'Dallas',
			experience_level: 'expert'
		}),

		Freelancers.create({
			id: freelancerIds.ichigo,
			first_name: 'Ichigo',
			last_name: 'Kurosaki',
			username: 'ikurosaki',
			email: 'ichigo@kurosaki.com',
			password: 'password',
			job_title: 'Jack of All Trades',
			rate: 25,
			gender: 'male',
			age: 16,
			field_id: fieldIds.web_and_mobile,
			summary: 'Skilled in multiple different disciplines',
			state: 'TX',
			city: 'Austin',
			experience_level: 'intermediate'
		}),

		Freelancers.create({
			id: freelancerIds.izuku,
			first_name: 'Izuku',
			last_name: 'Midoriya',
			username: 'imidoriya',
			email: 'izuku@midoriya.com',
			password: 'password',
			job_title: 'Strong Full Stack Dev',
			rate: 45,
			gender: 'male',
			age: 16,
			field_id: fieldIds.full_stack,
			summary: 'Very strong developer, on both the front end and back end, you can call me deku',
			state: 'TX',
			city: 'Dallas',
			experience_level: 'expert'
		}),

		Freelancers.create({
			id: freelancerIds.leon,
			first_name: 'Leon',
			last_name: 'Kennedy',
			username: 'lkennedy',
			email: 'leon@kennedy.com',
			password: 'password',
			job_title: 'Skilled Tester',
			rate: 50,
			gender: 'male',
			age: 35,
			field_id: fieldIds.qa,
			summary: 'One of the best testers in the business, got a lot of experience working with the umbrella corporation, throw me into the thick of it.',
			state: 'OH',
			city: 'Raccoon',
			experience_level: 'expert'
		}),

		Freelancers.create({
			id: freelancerIds.dick,
			first_name: 'Dick',
			last_name: 'Grayson',
			username: 'dgrayson',
			email: 'dick@grayson.com',
			password: 'password',
			job_title: 'Flexible Developer',
			rate: 30,
			gender: 'male',
			age: 28,
			field_id: fieldIds.full_stack,
			summary: 'Very flexibile developer, I can work wherever you need me',
			state: 'NY',
			city: 'Gotham',
			experience_level: 'intermediate'
		}),
	]);
};
