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
			username: 'jreacher',
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
			username: 'sholmes',
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
			username: 'bwayne',
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

		Clients.create({
			id: clientIds.steve,
			first_name: 'Steve',
			last_name: 'Rogers',
			username: 'srogers',
			email: 'steve@rogers.com',
			password: 'password',
			gender: 'male',
			age: 88,
			field_id: fieldIds.other,
			summary: 'I stand for freedom',
			state: 'NY',
			city: 'New York',
			zip: '71010'
		}),

		Clients.create({
			id: clientIds.peter,
			first_name: 'Peter',
			last_name: 'Parker',
			username: 'pparker',
			email: 'peter@parker.com',
			password: 'password',
			gender: 'male',
			age: 15,
			field_id: fieldIds.full_stack,
			summary: 'Born in raised in Queens, i\'m super smart',
			state: 'NY',
			city: 'NY',
			zip: '71011'
		}),

		Clients.create({
			id: clientIds.tony,
			first_name: 'Tony',
			last_name: 'Stark',
			username: 'tstark',
			email: 'tony@stark.com',
			password: 'password',
			gender: 'male',
			age: 38,
			field_id: fieldIds.software,
			summary: 'I\'m a genius, can solve any problem',
			state: 'NY',
			city: 'NY',
			zip: '71011'
		}),

		Clients.create({
			id: clientIds.banner,
			first_name: 'Bruce',
			last_name: 'Banner',
			username: 'bbanner',
			email: 'bruce@banner.com',
			password: 'password',
			gender: 'male',
			age: 35,
			field_id: fieldIds.back_end,
			summary: 'Smart but not as smart as stark',
			state: 'NY',
			city: 'NY',
			zip: '71009'
		}),

		Clients.create({
			id: clientIds.natasha,
			first_name: 'Natasha',
			last_name: 'romanoff',
			username: 'nromanoff',
			email: 'natasha@romanoff.com',
			password: 'password',
			gender: 'female',
			age: 30,
			field_id: fieldIds.mobile_app,
			summary: 'Expert in apps, better than stark',
			state: 'CA',
			city: 'San Francisco',
			zip: '94114'
		}),

		Clients.create({
			id: clientIds.loki,
			first_name: 'Loki',
			last_name: 'Odinson',
			username: 'lodinson',
			email: 'loki@odinson.com',
			password: 'password',
			gender: 'male',
			age: 90,
			field_id: fieldIds.other,
			summary: 'Trickster',
		}),
	]);
};
