'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require('./src/config/knex')();
const router = require('./src/routes.js');

app.use('/', router);

const port = parseInt(process.env.PORT)?  parseInt(process.env.PORT) : 5000;

/* eslint-disable */
app.listen(port, () => {
	console.log('The server is listening on port: ', port);
});
/* eslint-enable */
