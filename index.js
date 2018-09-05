'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Setup a default catch-all route that sends back a welcome message in JSON format, just for inital setup purposes
app.get('*', (req, res) => res.status(200).send({
	message: 'Welcome to the beginning of nothingness.',
}));

require('./src/config/knex')();

const port = parseInt(process.env.PORT)?  parseInt(process.env.PORT) : 5000;

/* eslint-disable */
app.listen(port, () => {
	console.log('The server is listening on port: ', port);
});
/* eslint-enable */
