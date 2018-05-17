'use strict';


const random = new (require('chance'));
const Admins = require(`${process.cwd()}/src/models/admins`);

// used to create a random admin. If given no parameters, randomizes all fields.
module.exports = (opts = {}) => Admins.create({
	id: opts.id || random.guid(),
	first_name: opts.first_name || random.name(),
	last_name: opts.last_name || random.name(),
	username: opts.username || random.word(),
	email: opts.email || random.email(),
	password: opts.password || random.word()
});
