'use strict';


// This file is the main server routes file. It sets up the variables needed for express routing and all server side routes are required/are compiled in this file.
const express = require('express'),
	router = express.Router(),
	{ errors } = require('celebrate'),
	cors = require('cors'),
	// Set up a list of approved origins (servers) for cors and check against it
	whitelist = ['http://localhost:3000'],
	corsOptions = {
		origin: function (origin, callback) {
			if (whitelist.indexOf(origin) === -1) {
				// throw an error if the request came from an unrecognized/unapproved origin
				callback(new Error(`The Request origin came from ${origin}, which isn't allowed by CORS`));
			} else {
				// else we approve it and let the request continue
				callback(null, true);
			}
		}
	};


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
	// this must be before the app.use router line, so we can accept request from different servers, aka, the react server
	app.use(cors(corsOptions));
	app.use(router);
	// TODO: work on improving this, the messages it sends, how it looks on the front, etc.
	app.use(errors());
};
