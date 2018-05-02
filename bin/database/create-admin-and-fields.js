'use strict';


const Admins = require(`${process.cwd()}/src/models/admins`);
const Fields = require(`${process.cwd()}/src/models/fields`);
const fieldIds = require(`${process.cwd()}/seeds/ids/fields`);

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
				id: fieldIds.full_stack,
				field: 'Full Stack Web Development'
			}),
			Fields.create({
				id: fieldIds.front_end,
				field: 'Front End Web Development'
			}),
			Fields.create({
				id: fieldIds.back_end,
				field: 'Back End Web Development'
			}),
			Fields.create({
				id: fieldIds.software,
				field: 'Software Engineering'
			}),
			Fields.create({
				id: fieldIds.mobile_app,
				field: 'Mobile App Development'
			}),
			Fields.create({
				id: fieldIds.web_and_mobile,
				field: 'Web & Mobile Design'
			}),
			Fields.create({
				id: fieldIds.database,
				field: 'Database Administration'
			}),
			Fields.create({
				id: fieldIds.ecommerce,
				field: 'Ecommerce Development'
			}),
			Fields.create({
				id: fieldIds.qa,
				field: 'QA & Testing'
			}),
			Fields.create({
				id: fieldIds.other,
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
