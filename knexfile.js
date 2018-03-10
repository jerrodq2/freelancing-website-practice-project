'user strict';


require('dotenv').config();

const connectionOptions = require('./src/config/knex-connection-options.js');

module.exports = {

	development: connectionOptions,

	test: connectionOptions,

	staging: connectionOptions,

	production: connectionOptions

};
