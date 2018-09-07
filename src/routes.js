'use strict';


const express = require('express'),
	router = express.Router();


router.use((req, res, next) => {

	/* eslint-disable */
	console.log('req.method = ', req.method);
	console.log('req.url = ', req.url);
	/* eslint-enable */

	next();
});


router.get('/test', (req, res) => {
	return res.status(200).send({
		message: 'Welcome to the beginning of nothingness.',
	});
});

module.exports = router;
