'use strict';


const knex = require(`${process.cwd()}/src/config/knex`);


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
				field: 'Full Stack Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Full Stack Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Front End Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Back End Web Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Software Engineering',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Mobile App Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Web & Mobile Design',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Database Administration',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'Ecommerce Development',
				created_at: new Date()
			}),
			knex('fields').insert({
				field: 'QA & Testing',
				created_at: new Date()
			}),
			knex('fields').insert({
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
