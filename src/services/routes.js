'use strict';


// This file is the main server routes file. It sets up the variables needed for express routing and all server side routes are required/are compiled in this file.
const express = require('express'),
	router = express.Router(),
	{ errors } = require('celebrate'),
	cors = require('cors');


// TODO: Currently this router.use affects all server routes, leave it in for now, at least in development. See if you want to keep if in the finished product
// router.use() is used to define middleware that is appled to all routes/requests that come after it. Any code is applied before the routes, however any routes written before a router.use() block will not be affected by it
router.use((req, res, next) => {
	/* eslint-disable */
	console.log();
	console.log('Request made:', new Date().toString("yyyyMMddHHmmss"));
	console.log('Method =', req.method);
	console.log('Url =', req.url);
	/* eslint-enable */
	next();
});


// require the different server routes files here
require('./jobs/routes')(router);
require('./users/routes')(router);


module.exports = (app) => {
	// Then use it before your routes are set up:
	app.use(cors());
	app.use(router);
	// TODO: work on improving this, the messages it sends, how it looks on the front, etc.
	app.use(errors());
};
