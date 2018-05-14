'user strict';


require('dotenv').config();

const { connectionOptions, testOptions } = require('./src/config/knex-connection-options.js');


module.exports = {

	development: connectionOptions,

	test: testOptions,

	staging: connectionOptions,

	production: connectionOptions

};
