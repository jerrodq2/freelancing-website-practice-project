'use strict';


// This is the main index.js file used in the project. When node is started up, it goes to this file which controls the project and requires the other necessary files and npm modules
const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	listEndpoints = require('express-list-endpoints'),
	bunyan = require('bunyan'),
	log = bunyan.createLogger({ name: 'freelancer-website-practice-project' });
log.info('Hello World');
log.warn({ lang: 'fr' }, 'au revoir');

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
