'user strict';


// This file uses the options created in the below required file to import the environment appropriate knex connection options to the rest of the project.
require('dotenv').config();

const { connectionOptions, testOptions } = require('./src/config/knex-connection-options.js');


module.exports = {

	dev: connectionOptions,

	test: testOptions,

	staging: connectionOptions,

	prod: connectionOptions

};
