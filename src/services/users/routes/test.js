'use strict';


const express = require('express'),
	app = express(),
	router = express.Router();


router.get('/user', (req, res) => {
	res.status(200).send({
		message: 'Welcome to the beginning of nothingness.',
	});
});
app.use('/', router);
module.exports = router;
