'use strict';


const fields = require(`${process.cwd()}/seeds/ids/fields`);
const clients = require(`${process.cwd()}/seeds/ids/clients`);

exports.seed = (knex) => {
	// Deletes ALL existing entries
	return knex('clients').del()

		.then(function () {
		// Inserts seed entries
			return knex('clients').insert([
				{
					id: clients.jack,
					first_name: 'Jack',
					last_name: 'Reacher',
					username: 'jackreacher',
					email: 'jack@reacher.com',
					gender: 'male',
					field_id: fields.front_end,
					summary: 'Great client, I am very smart',
					state: 'TX',
					city: 'Dallas',
					zip: '75289',
					created_at: new Date()
				},

				{
					id: clients.sherlock,
					first_name: 'Sherlock',
					last_name: 'Holmes',
					username: 'sherlockholmes',
					email: 'sherlock@holmes.com',
					gender: 'male',
					field_id: fields.full_stack,
					summary: 'Got sick of Watson',
					state: 'TX',
					city: 'San Antonio',
					created_at: new Date()
				},

				{
					id: clients.bruce,
					first_name: 'Bruce',
					last_name: 'Wayne',
					username: 'brucewayne',
					email: 'bruce@wayne.com',
					gender: 'male',
					field_id: fields.software,
					summary: 'I expect the best.',
					state: 'TX',
					city: 'Gotham',
					created_at: new Date()
				}
			]);
		});
};
