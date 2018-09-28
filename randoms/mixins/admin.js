'use strict';


// This file is used to create a random admin record for testing. If given no parameters, randomizes all fields.
const random = new (require('chance'));
const Admins = require(`${process.cwd()}/src/services/users/models/admins`);


module.exports = (opts = {}) => Admins.create({
	id: opts.id || random.guid(),
	first_name: opts.first_name || random.name(),
	last_name: opts.last_name || random.name(),
	username: opts.username || `${random.guid().substring(0, 16)}-adminUserName`,
	email: opts.email || `${random.guid().substring(0, 16)}@admin.com`,
	password: opts.password || random.word()
});
