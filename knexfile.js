'user strict';


require('dotenv').config();

const { connectionOptions, testOptions } = require('./src/config/knex-connection-options.js');


module.exports = {

	dev: connectionOptions,

	test: testOptions,

	staging: connectionOptions,

	prod: connectionOptions

};
