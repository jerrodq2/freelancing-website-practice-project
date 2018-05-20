'use strict';


const random = new (require('chance'));
const Clients = require(`${process.cwd()}/src/models/clients`);

// used to create a random skill. If given no parameters, randomizes all fields.
// A field_id is required, for simplicity we don't create a new field here
module.exports = async (opts = {}) => Clients.create({
	id: opts.id || random.guid(),
	first_name: opts.first_name || random.name(),
	last_name: opts.last_name || random.name(),
	username: opts.username || `${random.guid().substring(0, 16)}-adminUserName`,
	email: opts.email || `${random.guid().substring(0, 16)}@client.com`,
	gender: opts.gender || 'male',
	age: opts.age || 20,
	field_id: opts.field_id,
	summary: opts.summary || random.paragraph(),
	state: opts.state || 'TX',
	city: opts.city || random.word(),
	zip: opts.zip || random.zip(),
	phone: opts.phone || random.phone(),
	dob: opts.dob || random.date({ string: true }),
	password: opts.password || random.word()
});
