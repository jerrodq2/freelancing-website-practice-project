'use strict';


const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	listEndpoints = require('express-list-endpoints');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require('dotenv').config();
require('./src/config/knex')();
require('./src/services/routes.js')(app);


const port = parseInt(process.env.PORT)?  parseInt(process.env.PORT) : 5000;
app.listen(port, () => {
	/* eslint-disable */

	console.log('The server is listening on port: ', port);
	// TODO: should we try to format this listEndpoints log statment better? Or remove it in prod?
	console.log('\nServer Side Endpoints: ');
	console.log(listEndpoints(app));

	/* eslint-enable */
});
