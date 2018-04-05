'use strict';


const Model = require('./model');
const Clients = new Model('clients');
const _ = require('lodash');


module.exports = {
	findOne (id) {
		return Clients.findOneUser(id)
			.then((client) => _.omit(client, 'password', 'field_id'));
	},


};
