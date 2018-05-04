'use strict';


const fieldIds = require(`${process.cwd()}/seeds/ids/fields`);
const clientIds = require(`${process.cwd()}/seeds/ids/clients`);
const Clients = require(`${process.cwd()}/src/models/clients`);

exports.seed = async (knex) => {
	// Deletes ALL existing entries
	await knex('clients').del();
	// Inserts seed entries
	return Promise.all([
		Clients.create({
			id: clientIds.jack,
			first_name: 'Jack',
			last_name: 'Reacher',
			username: 'jackreacher',
			email: 'jack@reacher.com',
			password: 'password',
			gender: 'male',
			age: 34,
			field_id: fieldIds.front_end,
			summary: 'Great client, I am very smart',
			state: 'TX',
			city: 'Dallas',
			zip: '75289'
		}),

		Clients.create({
			id: clientIds.sherlock,
			first_name: 'Sherlock',
			last_name: 'Holmes',
			username: 'sherlockholmes',
			email: 'sherlock@holmes.com',
			password: 'password',
			gender: 'male',
			age: 27,
			field_id: fieldIds.full_stack,
			summary: 'Got sick of Watson',
			state: 'TX',
			city: 'San Antonio',
			zip: '75050'
		}),

		Clients.create({
			id: clientIds.bruce,
			first_name: 'Bruce',
			last_name: 'Wayne',
			username: 'brucewayne',
			email: 'bruce@wayne.com',
			password: 'password',
			gender: 'male',
			age: 45,
			field_id: fieldIds.software,
			summary: 'I expect the best.',
			state: 'TX',
			city: 'Gotham',
			zip: '75289'
		}),
	]);
};
