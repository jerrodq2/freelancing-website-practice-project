'use strict';


const express = require('express'),
	router = express.Router(),
	controllers = require('./controllers');


// TODO: Currently this router.use affects all routes, leave it in for now, at least in development. See if you want to keep if in the finished product
// router.use() is used to define middleware that is appled to all routes/requests that come after it. Any code is applied before the routes, however any routes written before a router.use() block will not be affected by it
router.use((req, res, next) => {
	/* eslint-disable */
	console.log('Request made:', new Date().toString("yyyyMMddHHmmss"));
	console.log('Method =', req.method);
	console.log('Url =', req.url);
	/* eslint-enable */
	next();
});


router.get('/test', controllers.main.homepage);


module.exports = router;
