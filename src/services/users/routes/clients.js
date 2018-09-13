'use strict';


const ClientsController = require('../controllers/clients.js');

module.exports = (router) => {
	// just a test route
	router.get('/user', ClientsController.test);

};
