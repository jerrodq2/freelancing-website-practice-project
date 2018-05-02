'use strict';


const knex = require(`${process.cwd()}/src/config/knex`);
const Admins = require(`${process.cwd()}/src/models/admins`);
const Fields = require(`${process.cwd()}/src/models/fields`);
const fields = require(`${process.cwd()}/seeds/ids/fields`);
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);

const internals = {
	createAdmin () {
		return Admins.create({
			first_name: `${process.env.ADMIN_FIRST_NAME}`,
			last_name: `${process.env.ADMIN_LAST_NAME}`,
			username: `${process.env.ADMIN_USERNAME}`,
			email: `${process.env.ADMIN_EMAIL}`,
			password: `${process.env.ADMIN_PASSWORD}`
		});
	},

	createFields () {
		const queries = [
			Fields.create({
				id: fields.full_stack,
				field: 'Full Stack Web Development'
			}),
			Fields.create({
				id: fields.front_end,
				field: 'Front End Web Development'
			}),
			Fields.create({
				id: fields.back_end,
				field: 'Back End Web Development'
			}),
			Fields.create({
				id: fields.software,
				field: 'Software Engineering'
			}),
			Fields.create({
				id: fields.mobile_app,
				field: 'Mobile App Development'
			}),
			Fields.create({
				id: fields.web_and_mobile,
				field: 'Web & Mobile Design'
			}),
			Fields.create({
				id: fields.database,
				field: 'Database Administration'
			}),
			Fields.create({
				id: fields.ecommerce,
				field: 'Ecommerce Development'
			}),
			Fields.create({
				id: fields.qa,
				field: 'QA & Testing'
			}),
			Fields.create({
				id: fields.other,
				field: 'Other'
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
		console.log('Admin and initial fields created');
		return process.exit();
	});
