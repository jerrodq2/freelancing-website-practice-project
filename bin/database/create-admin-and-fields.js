'use strict';


const knex = require(`${process.cwd()}/src/config/knex`);
const queries = [];

const internals = {
	createAdmin () {
		return knex('admins').insert({ first_name: `${process.env.ADMIN_FIRST_NAME}`, last_name: `${process.env.ADMIN_LAST_NAME}`, username: `${process.env.ADMIN_USERNAME}`, email: `${process.env.ADMIN_EMAIL}` });
	},

	createFields () {
		queries.push(
			knex('fields').insert({ field: 'Web Development' })
		);
		queries.push(
			knex('fields').insert({ field: 'Full Stack Web Development' })
		);
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
