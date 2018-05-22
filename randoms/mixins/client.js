'use strict';


const random = new (require('chance'));
const Clients = require(`${process.cwd()}/src/models/clients`);
const { hashPassword } = require(`${process.cwd()}/src/lib/helper_functions`);

// used to create a random skill. If given no parameters, randomizes all fields.
// A field_id is required, for simplicity we don't create a new field here
module.exports = (opts = {}) => {
	let password;

	// When going through the clients mixin to create multiple client records (ex: 50), we don't hash every password, far too time consuming, so the 'dontHash' will be true, telling this mixin not to hash it, we hash the password in the clients mixin, and it is passed in the opts object. If 'dontHash' is false, then we hash either the given plain password or a random word like normal.
	if (opts.dontHash) {
		password = opts.password;
	} else {
		password = hashPassword(opts.password) || hashPassword(random.word());
	}

	return Clients.createWithoutHash({
		id: opts.id || random.guid(),
		first_name: opts.first_name || random.name(),
		last_name: opts.last_name || random.name(),
		username: opts.username || `${random.guid().substring(0, 16)}-clientUserName`,
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
		password,
	});
};
