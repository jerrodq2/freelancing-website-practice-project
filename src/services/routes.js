'use strict';


const express = require('express'),
	router = express.Router();


// TODO: Currently this router.use affects all routes, leave it in for now, at least in development. See if you want to keep if in the finished product
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


// placeholder route for a temporary homepage. TODO: change to later redirect to react (similar to an angular app)
router.get('/', (req, res) => {
	res.sendFile(`${process.cwd()}/public/index.html`);
});

require('./users/routes/clients.js')(router);


module.exports = (app) => {
	app.use(router);
};
