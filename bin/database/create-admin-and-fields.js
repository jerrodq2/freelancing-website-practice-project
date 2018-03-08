'use strict';


const knex = require(`${process.cwd()}/src/config/knex`);
const fields = require(`${process.cwd()}/seeds/ids/fields`);

const internals = {
	createAdmin () {
		return knex('admins').insert({
			first_name: `${process.env.ADMIN_FIRST_NAME}`,
			last_name: `${process.env.ADMIN_LAST_NAME}`,
			username: `${process.env.ADMIN_USERNAME}`,
			email: `${process.env.ADMIN_EMAIL}`,
			created_at: new Date() });
	},

	createFields () {
		const queries = [
			knex('fields').insert({
				id: fields.full_stack,
				field: 'Full Stack Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.front_end,
				field: 'Front End Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.back_end,
				field: 'Back End Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.software,
				field: 'Software Engineering',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.mobile_app,
				field: 'Mobile App Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.web_and_mobile,
				field: 'Web & Mobile Design',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.database,
				field: 'Database Administration',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.ecommerce,
				field: 'Ecommerce Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.qa,
				field: 'QA & Testing',
				created_at: new Date()
			}),
			knex('fields').insert({
				id: fields.other,
				field: 'Other',
				created_at: new Date()
			}),
		];

		return Promise.all(queries);
	}
};

Promise.all([
	internals.createAdmin(),
	internals.createFields(),
])
	.then(() => {
		console.log('Admin and inital fields created');
		return process.exit();
	});
