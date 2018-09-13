'use strict';


// const Clients = require('../models/clients.js');


module.exports = {

	test: (req, res) => {
		return res.status(200).send({ message: 'User router here' });
	},

};
